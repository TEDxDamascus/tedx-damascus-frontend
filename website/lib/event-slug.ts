import { readCmsQueryValue } from '@/lib/utils';

/** Statically exported shell path: /{locale}/events/detail/ */
export const EVENT_DETAIL_SHELL_SLUG = 'detail';

export function eventDetailHref(locale: string, slug: string): string {
  return `/${locale}/events/${EVENT_DETAIL_SHELL_SLUG}/?slug=${encodeURIComponent(slug)}`;
}

export function resolveEventSlug(
  pathname: string,
  searchSlug: string | null | undefined,
  paramSlug?: string,
): string {
  const fromQuery = readCmsQueryValue(searchSlug);
  if (fromQuery) return fromQuery;

  const parts = pathname.split('/').filter(Boolean);
  const eventsIdx = parts.findIndex((part) => part === 'events');
  const fromPath = eventsIdx >= 0 ? readCmsQueryValue(parts[eventsIdx + 1]) : '';
  if (fromPath && fromPath !== EVENT_DETAIL_SHELL_SLUG) {
    return fromPath;
  }

  const fromParam = readCmsQueryValue(paramSlug);
  if (fromParam && fromParam !== EVENT_DETAIL_SHELL_SLUG) {
    return fromParam;
  }

  return '';
}
