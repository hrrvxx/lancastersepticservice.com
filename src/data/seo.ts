// Bottom-of-funnel + long-tail keyword targeting per service (rnr-site Phase 5, research 2026-10-27:
// engine/data/kw-lancastersepticservice.com.json, Los Angeles DMA). Used by /services/{slug} and
// /service-areas/{city}/{slug}. {{city}} and {{phone}} are filled per page. No prices, coverage, license,
// certification or 24/7 claims here: those need owner approval.
import type { Faq } from './types';
import { site } from './site';

export interface ServiceSeo {
  titleKw: string;   // keyword-first title phrase; page title = `${titleKw} in ${city}, CA`
  metaDesc: string;  // ~150 chars with {{city}} and {{phone}}
  section: { h2: string; body: string; bullets: string[] };
  faqs: Faq[];       // long-tail questions appended to the page FAQs (and FAQPage schema)
}

export const serviceSeo: Record<string, ServiceSeo> = {
  'septic-tank-pumping': {
    titleKw: 'Septic Tank Pumping & Cleaning',
    metaDesc: 'Septic tank pumping and cleaning in {{city}}, CA. Our local crew pumps the tank, checks baffles and levels, and keeps records. Call {{phone}}.',
    section: {
      h2: 'Septic Pumping Near You in {{city}}',
      body: 'Regular septic tank pumping is the cheapest way to protect the rest of the system. Our crew uncovers the lids, pumps out the sludge and scum layers, looks at the baffles and the liquid level while the tank is open, and tells you what we saw so you know when the next pump-out is due.',
      bullets: [
        'Full septic tank cleaning, both compartments where the tank has two',
        'Baffles, inlet and outlet checked while the tank is open',
        'Liquid level noted to spot a slow leach field or seepage pit',
        'Lids located and dug out, with riser options for next time',
        'Service record so you can plan the next pump-out',
      ],
    },
    faqs: [
      { q: 'Is septic tank pumping the same as septic tank cleaning?', a: 'People use both terms for the same job: removing the sludge and scum that build up in the tank. A thorough cleaning means pumping every compartment and breaking up the solids so they come out, not just drawing down the liquid. We pump the whole tank and let you know what condition it is in.' },
      { q: 'How long does a septic tank last?', a: 'It depends on the material and how the system is used. Concrete and plastic tanks can last for decades with regular pumping, while older steel tanks tend to rust out sooner. The leach field or seepage pit often needs attention before the tank itself does, and skipping pump-outs shortens the life of both.' },
    ],
  },
  'seepage-pit-pumping': {
    titleKw: 'Seepage Pit & Cesspool Pumping',
    metaDesc: 'Seepage pit and cesspool pumping in {{city}}, CA. We pump pits, check how fast they drain and explain options if one is failing. Call {{phone}}.',
    section: {
      h2: 'Seepage Pit Pumping in {{city}}',
      body: 'Many properties around {{city}} send septic water to a seepage pit instead of a leach field. When a pit fills up and stops draining, pumping it buys time and lets us see how it is performing. We pump seepage pits and older cesspools, watch how quickly they refill, and explain whether the pit can be revived or needs to be replaced.',
      bullets: [
        'Seepage pit and cesspool pumping with the tank serviced in the same visit',
        'Refill rate watched to judge how well the pit is draining',
        'Cap and access checked for safety',
        'Clear options when a pit is failing: rest, rehab or a new pit',
        'Help reading older county permit drawings to find the pit',
      ],
    },
    faqs: [
      { q: 'Is a seepage pit the same as a cesspool?', a: 'Not quite. A seepage pit normally receives liquid that has already passed through a septic tank, so most solids have settled out. A cesspool takes raw sewage straight from the house with no tank in front of it. Many older properties have cesspools, and they usually fill and fail faster because of the solids.' },
      { q: 'What are the signs of a failing seepage pit?', a: 'Common signs are slow drains throughout the house, a septic tank that is full again soon after pumping, gurgling plumbing, sewage smells near the pit, and wet or sunken ground around the cap. If the tank level keeps rising after a pump-out, the pit is probably no longer absorbing water fast enough.' },
    ],
  },
  'septic-inspection': {
    titleKw: 'Septic Tank & System Inspection',
    metaDesc: 'Septic inspection in {{city}}, CA for home sales and owners. We open the tank, check baffles and drainage, and write it up. Call {{phone}}.',
    section: {
      h2: 'Septic System Inspections in {{city}}',
      body: 'Whether you are buying, selling or just want to know where your system stands, a septic system inspection shows how the tank and the drainage side are working. We locate and open the tank, check the baffles and levels, run water to see how the field or pit takes it, and put what we find in a plain written report.',
      bullets: [
        'Tank located, opened and checked for cracks and baffle damage',
        'Sludge and scum levels measured',
        'Leach field or seepage pit checked for slow drainage',
        'Septic inspection for home sale timelines and escrow',
        'Written report with photos and next steps',
      ],
    },
    faqs: [
      { q: 'What is checked during a septic inspection?', a: 'A full inspection covers the tank lids and risers, the tank walls, the inlet and outlet baffles, sludge and scum depth, the line to the leach field or seepage pit, and signs of trouble in the drainage area such as wet spots or odors. Any pump, alarm or distribution box on the system gets checked too.' },
      { q: 'Is a septic inspection the same as a septic certification?', a: 'Lenders and escrow companies sometimes ask for a "septic certification," and what they want varies. Usually it is an inspection report showing the system was working when it was checked. Ask your agent or lender exactly which form or report they need, and we will tell you whether our inspection report covers it.' },
    ],
  },
  'septic-repair': {
    titleKw: 'Septic Tank & System Repair',
    metaDesc: 'Septic repair in {{city}}, CA: broken baffles, cracked lids, failed pumps, alarms and blocked lines found and fixed by a local crew. Call {{phone}}.',
    section: {
      h2: 'Septic Repair Near You in {{city}}',
      body: 'Most septic problems start small: a broken baffle, a cracked lid, a pump that stops running or a line that clogs. Our crew finds the cause, not just the symptom, and repairs the part that failed so you are not paying for a whole new system when a repair will do.',
      bullets: [
        'Inlet and outlet baffle repair and replacement',
        'Septic pump, float and alarm repairs',
        'Cracked lids, risers and tank openings sealed or replaced',
        'Blocked lines between the house, tank and field cleared',
        'Free repair quote before any work starts',
      ],
    },
    faqs: [
      { q: 'What are the most common septic tank repairs?', a: 'The repairs we see most are broken or missing baffles, cracked or unsafe lids, clogged inlet or outlet lines, failed effluent pumps and floats, and roots in the lines. Many of these show up during a routine pump-out, which is one reason regular pumping saves money.' },
      { q: 'When does a septic pump need to be replaced?', a: 'If your system has an effluent or lift pump and the alarm keeps going off, the pump runs constantly, or it hums without moving water, it may need repair or replacement. Sometimes the problem is only the float switch or the alarm. We test the pump and controls before recommending a new one.' },
    ],
  },
  'leach-field-repair': {
    titleKw: 'Leach Field & Drain Field Repair',
    metaDesc: 'Leach field repair in {{city}}, CA: wet spots, odors and slow drains traced to the cause, with leach line repair options. Call {{phone}}.',
    section: {
      h2: 'Drain Field and Leach Line Repair in {{city}}',
      body: 'A struggling leach field shows up as soggy ground, sewage smells, lush green strips over the lines or drains that back up after heavy use. We find out whether the problem is a clogged line, a crushed pipe, a distribution box issue or a field that has reached the end of its life, then repair what can be saved.',
      bullets: [
        'Leach line repair for crushed, broken or root-filled pipes',
        'Distribution box checked and leveled',
        'Lines jetted and inspected with a camera',
        'Leach field replacement planned when repair will not last',
        'County requirements explained before larger work',
      ],
    },
    faqs: [
      { q: 'How long does a leach field last?', a: 'There is no single number. A well-sized field on a system that is pumped regularly can work for decades, while one that receives solids from a neglected tank, too much water or roots can fail much sooner. Soil, groundwater and how the field was built all play a part.' },
      { q: 'Can a leach field be cleaned instead of replaced?', a: 'Sometimes. If the lines are clogged with sludge or roots, jetting them and pumping the tank can bring a field back. Resting a field, by switching to a second field or cutting water use, can also help. If the soil itself is sealed with biomat, the field usually needs to be replaced or expanded.' },
    ],
  },
  'septic-installation': {
    titleKw: 'Septic Installation & Replacement',
    metaDesc: 'Septic system installation and replacement in {{city}}, CA: tanks, leach fields and seepage pits planned around county rules. Call {{phone}}.',
    section: {
      h2: 'Septic Tank Installation in {{city}}',
      body: 'A new septic system starts with the lot, the soil and the county rules. We work through the percolation test, the design and the permit steps with you, then install the septic tank and the leach field or seepage pit so the system passes inspection and is easy to service later.',
      bullets: [
        'New septic system installation for new homes and additions',
        'Septic tank replacement for cracked, rusted or undersized tanks',
        'Leach field and seepage pit installation matched to the soil',
        'Perc test, design and permit steps coordinated',
        'Risers installed so future pumping is easy',
      ],
    },
    faqs: [
      { q: 'What size septic tank do I need?', a: 'Tank size is usually based on the number of bedrooms or the expected daily water use, with minimums set by your county. Larger homes, guest units and garbage disposals can call for a bigger tank. We size the tank and the drainage system to meet the county requirements for your property.' },
      { q: 'Do I need a permit to replace a septic system?', a: 'Replacing a septic tank, leach field or seepage pit normally requires a permit and inspections from the county environmental health department, and some jobs need a percolation test and a design first. Requirements differ between Los Angeles County and Kern County, so we check what applies to your address early.' },
    ],
  },
  'septic-risers': {
    titleKw: 'Septic Tank Riser & Lid Installation',
    metaDesc: 'Septic riser and lid installation in {{city}}, CA. Tank lids brought to grade with secure covers, so pumping means no digging. Call {{phone}}.',
    section: {
      h2: 'Septic Tank Risers and Lids in {{city}}',
      body: 'If every pump-out starts with digging up the yard to find the lids, a septic tank riser fixes that for good. We extend each tank opening up to ground level and finish it with a secure lid, so the tank can be pumped and inspected quickly and nobody has to dig again.',
      bullets: [
        'Risers installed on every tank opening',
        'Septic tank lid replacement for cracked or missing covers',
        'Secure, child-resistant lids at grade',
        'Riser joints sealed to keep out dirt and runoff',
        'Lid locations marked for future service',
      ],
    },
    faqs: [
      { q: 'What is a septic tank riser?', a: 'A riser is a short plastic or concrete shaft that extends a tank opening up to the surface. It is topped with a lid you can open without digging, so pumping and inspections are faster and you always know where the tank is.' },
      { q: 'Do I need a new septic tank lid?', a: 'Replace a lid that is cracked, sagging, rusted or loosely covered with plywood or boards. A failed lid is a serious fall hazard for children and pets, and it lets dirt and rainwater into the tank. A secure lid on a riser solves both problems.' },
    ],
  },
  'grease-trap-pumping': {
    titleKw: 'Grease Trap Pumping & Cleaning',
    metaDesc: 'Grease trap pumping and cleaning in {{city}}, CA for restaurants and commercial kitchens, scheduled around service hours. Call {{phone}}.',
    section: {
      h2: 'Grease Trap Cleaning Near You in {{city}}',
      body: 'Restaurants, cafes, schools and other commercial kitchens need their grease traps and interceptors pumped before fats, oils and solids back up the drains. We pump the trap fully, scrape down the walls and baffles, and work around your prep and service hours so the kitchen keeps running.',
      bullets: [
        'Grease trap and grease interceptor pumping',
        'Walls, baffles and inlets scraped and cleared',
        'Service scheduled before opening or after close',
        'Recurring schedule set to match your kitchen volume',
        'Service record after every pump-out',
      ],
    },
    faqs: [
      { q: 'What happens if a grease trap is not cleaned?', a: 'Grease and solids build up until the trap stops separating them, and grease passes into the sewer or septic line. That leads to slow drains, backups in the kitchen, foul odors and clogged lines downstream. It can also cause problems with local inspections, so regular pumping is cheaper than an emergency call.' },
      { q: 'Do you give a record of each grease trap service?', a: 'Yes. After each pump-out we give you a record of the date and the work done, so you can keep it with your kitchen paperwork and show it if an inspector asks when the trap was last serviced.' },
    ],
  },
  'emergency-septic-service': {
    titleKw: 'Emergency Septic Service & Pumping',
    metaDesc: 'Emergency septic service in {{city}}, CA: sewage backups, overflowing tanks and alarms handled fast by a local crew. Call {{phone}}.',
    section: {
      h2: 'Septic Backup Help in {{city}}',
      body: 'When sewage is backing up into the house or the tank is overflowing in the yard, you need someone who can pump the tank and find out why. Call us and we will tell you what to do while we are on the way, then pump, clear the blockage and explain what caused the backup.',
      bullets: [
        'Emergency septic pumping for full or overflowing tanks',
        'Sewage backup traced to the tank, line, field or plumbing',
        'Blocked inlet lines and baffles cleared',
        'Alarm calls on pump systems',
        'Advice on cleanup and keeping water use down',
      ],
    },
    faqs: [
      { q: 'What should I avoid doing during a septic backup?', a: 'Stop running water, flushing toilets, and using the washer or dishwasher, because every gallon adds to the backup. Do not pour drain cleaners or chemicals into the system, and keep people and pets away from any sewage. Do not open or climb into the tank yourself; septic gases are dangerous.' },
      { q: 'Can I use water while I wait for emergency septic service?', a: 'Keep it to the minimum. If you must use water, use it somewhere that drains to a different line, such as an outdoor spigot. Holding off on laundry, showers and flushing until the tank is pumped helps keep sewage from coming back up into the house.' },
    ],
  },
  'septic-line-jetting': {
    titleKw: 'Hydro Jetting & Camera Inspection',
    metaDesc: 'Hydro jetting and sewer camera inspection in {{city}}, CA: septic lines cleared of roots, grease and sludge, then checked on camera. Call {{phone}}.',
    section: {
      h2: 'Septic Line Hydro Jetting in {{city}}',
      body: 'Clogged lines between the house, the tank and the leach field cause backups even when the tank is not full. Hydro jetting uses high-pressure water to scour roots, grease and sludge out of the pipe, and a sewer camera inspection afterward shows whether the line is clean, cracked or sagging.',
      bullets: [
        'Hydro jetting for house-to-tank and tank-to-field lines',
        'Roots in the septic line cut back and flushed',
        'Sewer camera inspection of the full line',
        'Breaks, offsets and sags located before digging',
        'Leach lines jetted to help a slow field',
      ],
    },
    faqs: [
      { q: 'What is hydro jetting?', a: 'Hydro jetting sends water through a special hose and nozzle at high pressure to scrub the inside of a pipe. Unlike a cable snake, which punches a hole through a clog, jetting cleans the full width of the pipe, so grease, sludge and fine roots are flushed out instead of left on the walls.' },
      { q: 'How is a septic line camera inspection done?', a: 'We feed a waterproof camera on a flexible cable through a cleanout or the tank opening and watch the live picture as it travels down the line. A locator shows where the camera is above ground, so we can mark the exact spot of a break, root intrusion or sag.' },
    ],
  },
  'septic-tank-locating': {
    titleKw: 'Septic Tank Locating Service',
    metaDesc: 'Septic tank locating in {{city}}, CA. We find your septic tank and lids with probes and line tracing, then mark them for next time. Call {{phone}}.',
    section: {
      h2: 'Find Your Septic Tank in {{city}}',
      body: 'Lost lids are common on older properties and after a home sale. We find the septic tank by tracing the line from the house, probing and, when needed, using a transmitter in the line, then dig up the lids and mark the spot so the next pump-out is easy.',
      bullets: [
        'Septic tank locator tools and line tracing from the house',
        'Lids uncovered and the tank opened if you need pumping',
        'Seepage pit and leach field located too',
        'Locations marked or sketched for your records',
        'Riser options so you never have to search again',
      ],
    },
    faqs: [
      { q: 'Can you mark my septic tank so I can find it next time?', a: 'Yes. Once we find the tank we can mark the lid locations, sketch the layout with measurements from the house, or install risers so the lids sit at ground level. Keep the sketch with your home records so the next service visit starts right away.' },
      { q: 'Do county records show where my septic tank is?', a: 'Sometimes. The county environmental health department may have permit drawings for your property, especially for newer systems, and they can save time. Older systems often have no drawings or inaccurate ones, which is when tracing and probing on site are needed.' },
    ],
  },
};

const fill = (t: string, city: string) => t.replaceAll('{{city}}', city).replaceAll('{{phone}}', site.phoneDisplay);

/** Keyword targeting for one service, with {{city}} and {{phone}} filled. */
export function seoFor(slug: string, city: string) {
  const s = serviceSeo[slug];
  if (!s) return undefined;
  const title = `${s.titleKw} in ${city}, ${site.stateAbbr}`;
  const branded = `${title} | ${site.name}`;
  return {
    title: branded.length <= 60 ? branded : title,
    metaDesc: fill(s.metaDesc, city),
    section: { h2: fill(s.section.h2, city), body: fill(s.section.body, city), bullets: s.section.bullets.map(b => fill(b, city)) },
    faqs: s.faqs.map(f => ({ q: fill(f.q, city), a: fill(f.a, city) })),
  };
}
