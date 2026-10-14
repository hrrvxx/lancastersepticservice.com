// City x service copy, one JSON file per city in ./local (keyed by service slug).
// Salt Lake City has none on purpose: /services/{slug} already targets "{service} in Salt Lake City".
import type { LocalService } from './types';

const files = import.meta.glob<Record<string, LocalService>>('./local/*.json', { eager: true, import: 'default' });

export const localServices: Record<string, Record<string, LocalService>> = Object.fromEntries(
  Object.entries(files).map(([path, data]) => [path.replace(/^.*\/(.+)\.json$/, '$1'), data]),
);

export function localService(citySlug: string, serviceSlug: string): LocalService | undefined {
  return localServices[citySlug]?.[serviceSlug];
}

/** Link for a service in a city: the local page when it exists, else the main service page. */
export function serviceHref(citySlug: string, serviceSlug: string): string {
  return localService(citySlug, serviceSlug) ? `/service-areas/${citySlug}/${serviceSlug}` : `/services/${serviceSlug}`;
}

/**
 * City context for site-wide navigation: on /service-areas/{city} and /service-areas/{city}/{service},
 * returns that city when it has local service pages, so header/footer service links stay in the city
 * instead of jumping to the main-city /services pages. Returns undefined everywhere else.
 */
export function cityFromPath(pathname: string): string | undefined {
  const m = pathname.replace(/\.html$/, '').match(/^\/service-areas\/([a-z0-9-]+)(?:\/|$)/);
  return m && localServices[m[1]] ? m[1] : undefined;
}
