// Content shapes shared by data files and pages.

export interface Card { title: string; text: string }
export interface Faq { q: string; a: string }

export interface Service {
  slug: string;            // e.g. "deck-installation" → /services/deck-installation
  name: string;            // "Deck Installation"
  short: string;           // card blurb, 30–45 words
  metaDescription: string; // ≤155 chars
  heroSub: string;         // 1–2 sentences under the H1
  intro: string[];         // 4 paragraphs, 80–120 words each
  benefits: Card[];        // 4 items, text 40–60 words
  faqs: Faq[];             // 4 items, answers 60–90 words
}

export interface Area {
  slug: string;            // "west-valley-city"
  name: string;            // "West Valley City"
  zips: string[];          // ZIP codes served (Census ZCTAs via the rnr-site city-zips.mjs script)
  metaDescription: string;
  heroSub: string;
  paragraphs: string[];    // 4 paragraphs, 90–130 words each
  neighborhoods: string[]; // 4–8 real neighborhoods/landmarks
  driveNote: string;       // 1 sentence: typical drive from central Salt Lake City
  summary: string;         // 1–2 sentences for the service-areas index card
  note: string;            // 1 unique local sentence for the Local Area box (landmark + deck angle)
  direction: string;       // "south of" -> "X is located in <county>, south of downtown <main city>." ("" for the main city)
  nearby: string[];        // 3–5 neighboring city names (must match other entries' names)
  county?: string;         // county for the location line when it differs from site.county
  locationLine?: string;   // full location sentence override (main city)
  pageTitle?: string;      // full <title> override, no brand suffix (main city page, to avoid competing with the homepage)
  heading?: string;        // overrides the default city page H1
}

export interface Longform { eyebrow: string; title: string; sub: string; paragraphs: string[] }

export interface HomeContent {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroSub: string;
  servicesSub: string;
  phoneStrip: { title: string; text: string };
  why: { eyebrow: string; title: string; sub: string; cards: Card[] };          // 6 cards, text 60–80 words
  process: { eyebrow: string; title: string; sub: string; steps: Card[] };      // 3 steps, text 60–80 words
  about: { eyebrow: string; title: string; paragraphs: string[] };             // 4 paragraphs
  faqSub: string;
  faqs: Faq[];                                                                  // 8 items, answers 80–110 words
  pain: { eyebrow: string; title: string; sub: string; cards: Card[] };         // 3 cards
  gallerySub: string;
  local: { eyebrow: string; title: string; sub: string; paragraphs: string[] }; // 6 paragraphs, 100–130 words
  materials: Longform;  // 4 paragraphs
  pricing: Longform;    // 4 paragraphs
  timeline: Longform;   // 3 paragraphs
  areasIntro: string[]; // 3 paragraphs
  cta: { title: string; text: string };
}

export interface AboutContent {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSub: string;
  storyTitle: string;
  story: string[];      // 4 paragraphs
  values: { eyebrow: string; title: string; sub: string; cards: Card[] }; // 3 cards
}

// Unique copy for one service in one city (/service-areas/{city}/{service}).
export interface LocalService {
  metaDescription: string; // 130–155 chars
  heroSub: string;
  paragraphs: string[];    // 3 paragraphs, 90–120 words, city + service specific
  faqs: Faq[];             // 2 local FAQs
}
