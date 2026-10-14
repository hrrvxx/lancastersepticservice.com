// Site-wide settings. Phone is the Plivo tracking number.
export const site = {
  name: 'Lancaster Septic Service',
  url: 'https://lancastersepticservice.com',
  city: 'Lancaster',
  state: 'California',
  stateAbbr: 'CA',
  county: 'Los Angeles County', // default for city-page location lines (Area.county overrides)
  region: 'Antelope Valley',    // "working across the ..."
  niche: 'septic service company', // singular, for anchor text like "Lancaster septic service company"
  nicheShort: 'septic service',    // "{nicheShort} serving {city}" headings
  phoneDisplay: '(818) 214-7434',
  phoneTel: '+18182147434',
  geo: { lat: 34.6868, lng: -118.1542 },
  tagline: 'Septic Tank Pumping for the Antelope Valley',
  // Business description for schema.org (one sentence).
  description: 'Locally owned Lancaster septic service company: septic tank pumping, seepage pit pumping, septic inspections, septic and leach field repair, riser installation and new septic systems across the Antelope Valley.',
  leadEndpoint: '/api/lead',
  // Cloudflare Turnstile site key (public). Empty = widget not rendered.
  turnstileSiteKey: '0x4AAAAAAFWyjrKry4nmseQ6',
};

export const tel = `tel:${site.phoneTel}`;

/** Page title with the brand suffix only when the whole title stays within 60 characters. */
export const withBrand = (title: string) => (title.length + site.name.length + 3 <= 60 ? `${title} | ${site.name}` : title);

// Services shown on the homepage grid and in the footer (highest-demand first).
export const featuredServices = ['septic-tank-pumping', 'seepage-pit-pumping', 'septic-inspection', 'septic-repair', 'leach-field-repair', 'emergency-septic-service'];
