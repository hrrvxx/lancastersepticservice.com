// Worker entry: canonical-host redirects, /api/lead (Turnstile + Cloudflare Email Sending), then static assets.
const CANONICAL_HOST = 'lancastersepticservice.com';
// Every other domain attached to this Worker 301s to the canonical host (path and query kept).
const REDIRECT_HOSTS = new Set([
  'www.lancastersepticservice.com',
  'lancastersepticservices.com',
  'www.lancastersepticservices.com',
  // Production workers.dev URL: keep it from being indexed as a duplicate site.
  'lancastersepticservice-com.dropservicemarketingagency.workers.dev',
]);

// Canonical URLs have no trailing slash or .html (sitemap <loc> = canonical):
// /services/x/ and /services/x.html -> /services/x, /index.html -> /.
function canonicalPath(p) {
  let out = p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  if (out.length > 1) out = out.replace(/\/+$/, '');
  return out || '/';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isCanonicalHttp = url.hostname === CANONICAL_HOST && url.protocol === 'http:';
    const path = canonicalPath(url.pathname);
    // Host, http and path fixes in one 301 hop (asset trailing-slash handling would answer 307).
    if (REDIRECT_HOSTS.has(url.hostname) || isCanonicalHttp || path !== url.pathname) {
      return Response.redirect(`https://${CANONICAL_HOST}${path}${url.search}`, 301);
    }
    if (url.pathname === '/api/lead') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
      return handleLead(request, env);
    }
    const res = await env.ASSETS.fetch(request);
    if (env.STATS) ctx.waitUntil(statsHit(env, request, res.status));
    return res;
  },
};

// ---------- lead form ----------

async function handleLead(request, env) {
  // Binding: EMAIL (Cloudflare Email Sending). Secrets: TURNSTILE_SECRET, HUB_FORM_KEY. Vars: LEAD_TO, MAIL_FROM, SITE_NAME, SITE_PHONE (wrangler.jsonc).
  if (!env.EMAIL) return json({ ok: false, error: 'lead delivery not configured' }, 503);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.LEAD_LIMITER) {
    const { success } = await env.LEAD_LIMITER.limit({ key: ip });
    if (!success) return json({ ok: false, error: 'too many requests' }, 429);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad request' }, 400); }
  const lead = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 30),
    email: clean(body.email, 254).toLowerCase(),
    zip: clean(body.zip, 10),
    message: clean(body.message, 2000),
    service: clean(body.service, 60),
    page: clean(body.page, 200),
    elapsed: Number(body.elapsed) || 0, // ms from page load to submit (set by the form script)
  };
  if (!lead.name || (lead.phone.match(/\d/g) || []).length < 10 || !lead.message) {
    return json({ ok: false, error: 'missing fields' }, 400);
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) lead.email = '';

  // Bot check. Required whenever the secret is configured.
  if (env.TURNSTILE_SECRET) {
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET);
    form.append('response', String(body.turnstile || ''));
    form.append('remoteip', ip);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const result = await verify.json().catch(() => ({}));
    if (!result.success) {
      // e.g. invalid-input-secret (wrong TURNSTILE_SECRET), invalid-input-response, timeout-or-duplicate
      console.error('turnstile failed', JSON.stringify({ codes: result['error-codes'] || [], hostname: result.hostname || '', hasToken: !!body.turnstile }));
      return json({ ok: false, error: 'verification failed' }, 403);
    }
  }

  // Spam that gets past Turnstile (paid humans pitching SEO, web design, loans...): answer like a normal
  // lead so the sender learns nothing, file it in the dashboard as spam, and send no emails.
  const spamReason = spamCheck(lead, env);
  if (spamReason) {
    await saveToHub(env, lead, spamReason);
    console.log('lead flagged spam', JSON.stringify({ reason: spamReason, zip: lead.zip, page: lead.page }));
    return json({ ok: true });
  }

  const site = env.SITE_NAME || 'Website';
  const hubLink = await saveToHub(env, lead);
  const alert = await sendEmail(env, {
    from: env.MAIL_FROM,
    to: [env.LEAD_TO],
    reply_to: lead.email || undefined,
    subject: `New lead: ${lead.name}${lead.zip ? ` (${lead.zip})` : ''} - ${site}`,
    html: leadAlertHtml(lead, site, hubLink),
    text: leadAlertText(lead, site, hubLink),
  });
  if (!alert.ok) {
    console.error('lead alert failed', alert.status, alert.error);
    return json({ ok: false, error: 'delivery failed' }, 502);
  }
  console.log('lead delivered', JSON.stringify({ name: lead.name, service: lead.service, zip: lead.zip, page: lead.page, hasEmail: !!lead.email }));

  // Customer confirmation is best effort: never fail the lead because of it.
  if (lead.email) {
    const confirm = await sendEmail(env, {
      from: env.MAIL_FROM,
      to: [lead.email],
      reply_to: env.LEAD_TO,
      subject: `We received your request - ${site}`,
      html: confirmationHtml(lead, env),
      text: confirmationText(lead, env),
    });
    if (!confirm.ok) console.error('confirmation failed', confirm.status, confirm.error);
  }
  return json({ ok: true });
}

// ---------- spam scoring ----------

// Phrases that only show up in sales pitches, never in a homeowner's project request.
const SPAM_PATTERNS = [
  /\bSEO\b/i, /search engine optimi[sz]ation/i,
  /\b(google|bing|search)\b[^.]{0,40}\b(ranking|rankings|visibility|first page|page one|top results)\b/i,
  /\bbacklinks?\b/i, /guest post/i, /digital marketing/i, /web ?(design|development) (services|agency|team)/i,
  /\b(redesign|revamp) (of )?your (web)?site/i, /we (checked|reviewed|analy[sz]ed|audited|looked at) your (web)?site/i,
  /(increase|boost|grow|improve) your (online )?(traffic|sales|rankings|leads|presence)/i, /lead generation (service|agency|company)/i,
  /\b(bitcoin|crypto|forex)\b/i, /business (loan|funding|financing)/i, /merchant (cash|services)/i,
  /\b(virtual assistant|outsourc(e|ing))\b/i, /\bunsubscribe\b/i,
];

// Returns why a lead looks like spam, or null. One pitch phrase is enough; otherwise two weaker signals.
function spamCheck(lead, env) {
  const hit = SPAM_PATTERNS.find(p => p.test(`${lead.name}\n${lead.message}`));
  if (hit) return `pitch phrase ${hit}`;
  let score = 0;
  const why = [];
  const prefixes = String(env.SERVICE_ZIP_PREFIXES || '').split(',').map(s => s.trim()).filter(Boolean);
  if (lead.zip && prefixes.length && !prefixes.some(p => lead.zip.startsWith(p))) { score++; why.push(`out-of-area ZIP ${lead.zip}`); }
  if (/https?:\/\/|www\.|\.(com|net|io|co)\b/i.test(lead.message)) { score++; why.push('link in message'); }
  if (lead.elapsed && lead.elapsed < 3000) { score += 2; why.push(`submitted ${lead.elapsed} ms after page load`); }
  return score >= 2 ? why.join(', ') : null;
}

// Store the lead in the RNR dashboard. Best effort: the email alert still goes out if this fails.
// Vars: HUB_URL, HUB_SITE_ID. Secret: HUB_FORM_KEY (the hub's FORM_KEY; a secret named FORM_KEY also works).
async function saveToHub(env, lead, spamReason) {
  const formKey = env.HUB_FORM_KEY || env.FORM_KEY;
  if (!env.HUB_URL || !env.HUB_SITE_ID || !formKey) return null;
  try {
    const res = await fetch(`${env.HUB_URL}/api/form-lead`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${formKey}`, 'Content-Type': 'application/json' },
      // The dashboard has no service column yet, so the service leads the message.
      body: JSON.stringify({
        site: env.HUB_SITE_ID, ...lead,
        message: lead.service ? `Service: ${lead.service}\n${lead.message}` : lead.message,
        ...(spamReason ? { status: 'spam', spam_reason: spamReason } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      console.error('hub save failed', res.status, JSON.stringify(data));
      return null;
    }
    return data.id ? `${env.HUB_URL}/leads/${data.id}` : `${env.HUB_URL}/leads`;
  } catch (err) {
    console.error('hub save failed', String(err));
    return null;
  }
}

// Email: Cloudflare Email Sending (EMAIL binding; the from-domain must be onboarded in Email Service).
// Payload: from/reply_to as "Name <addr>", to as a string or array.
async function sendEmail(env, payload) {
  try {
    const msg = { from: parseAddress(payload.from), to: payload.to, subject: payload.subject, html: payload.html, text: payload.text };
    if (payload.reply_to) msg.replyTo = parseAddress(payload.reply_to);
    await env.EMAIL.send(msg);
    return { ok: true, status: 200, error: null };
  } catch (err) {
    console.error('email send failed', err?.code, err?.message);
    return { ok: false, status: 0, error: `${err?.code || ''} ${err?.message || err}` };
  }
}

// "Brand <a@b.com>" -> { email, name }
function parseAddress(a) {
  const m = String(a).match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? (m[1] ? { email: m[2], name: m[1] } : { email: m[2] }) : { email: String(a).trim() };
}

// ---------- email bodies ----------

function leadAlertHtml(l, site, hubLink) {
  const row = (k, v) => (v ? `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>` : '');
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">
<h2 style="margin:0 0 12px">New website lead: ${esc(site)}</h2>
<table>${row('Name', esc(l.name))}${row('Phone', `<a href="tel:${esc(l.phone.replace(/[^\d+]/g, ''))}">${esc(l.phone)}</a>`)}${row('Email', l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : '')}${row('Service', esc(l.service))}${row('ZIP', esc(l.zip))}${row('Project', esc(l.message).replace(/\n/g, '<br>'))}${row('Page', esc(l.page))}</table>
${hubLink ? `<p><a href="${esc(hubLink)}">Open in dashboard</a></p>` : ''}
<p style="color:#666;font-size:13px">Call them back quickly. Fast responses win the job.</p></div>`;
}

function leadAlertText(l, site, hubLink) {
  return `New website lead: ${site}\n\nName: ${l.name}\nPhone: ${l.phone}\n${l.email ? `Email: ${l.email}\n` : ''}${l.service ? `Service: ${l.service}\n` : ''}${l.zip ? `ZIP: ${l.zip}\n` : ''}Project: ${l.message}\nPage: ${l.page}\n${hubLink ? `\nDashboard: ${hubLink}\n` : ''}`;
}

function confirmationHtml(l, env) {
  const site = esc(env.SITE_NAME || '');
  const phone = esc(env.SITE_PHONE || '');
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222;max-width:560px">
<p>Hi ${esc(l.name.split(' ')[0])},</p>
<p>Thanks for contacting ${site}. We received your request and someone from our team will call you shortly to talk through your project and set up your free estimate.</p>
<p style="background:#f5f5f5;padding:12px;border-radius:6px"><strong>Your request:</strong><br>${esc(l.message).replace(/\n/g, '<br>')}</p>
<p>Need us sooner? Call <strong>${phone}</strong>, or just reply to this email.</p>
<p>${site}</p></div>`;
}

function confirmationText(l, env) {
  return `Hi ${l.name.split(' ')[0]},\n\nThanks for contacting ${env.SITE_NAME}. We received your request and someone from our team will call you shortly to talk through your project and set up your free estimate.\n\nYour request:\n${l.message}\n\nNeed us sooner? Call ${env.SITE_PHONE}, or just reply to this email.\n\n${env.SITE_NAME}\n`;
}

// ---------- utils ----------

function clean(v, max) {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function json(obj, status = 200) {
  return Response.json(obj, { status, headers: { 'Cache-Control': 'no-store' } });
}

// ---------- RNR Stats bot log ----------
// Every page request (static media skipped) goes to the rnr-stats Worker over the STATS service binding
// (RPC entrypoint Hits; see stats/SPEC.md). Feeds the Bots page at stats.dsmagency.io.
const STATS_SKIP = /\.(css|js|mjs|map|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|eot|mp4|webm|mp3)$/i;
async function statsHit(env, request, status) {
  try {
    const url = new URL(request.url);
    if ((request.method !== 'GET' && request.method !== 'HEAD') || STATS_SKIP.test(url.pathname)) return;
    const cf = request.cf || {};
    await env.STATS.hit({
      site: env.HUB_SITE_ID, path: url.pathname, status, ua: request.headers.get('user-agent') || '', ip: request.headers.get('cf-connecting-ip') || '',
      country: cf.country, region: cf.region, city: cf.city, asn: cf.asn, isp: cf.asOrganization, ref: request.headers.get('referer') || '',
    });
  } catch (e) {}
}
