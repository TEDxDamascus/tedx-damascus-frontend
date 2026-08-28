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
  const fromQuery = searchSlug?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const eventsIdx = parts.findIndex((part) => part === 'events');
  const fromPath = eventsIdx >= 0 ? parts[eventsIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? decodeURIComponent(fromPath) : '';
  if (decodedPath && decodedPath !== EVENT_DETAIL_SHELL_SLUG) {
    return decodedPath;
  }

  if (paramSlug && paramSlug !== EVENT_DETAIL_SHELL_SLUG) {
    return paramSlug;
  }

  return '';
}
