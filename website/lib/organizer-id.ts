import { readCmsQueryValue } from '@/lib/utils';

/** Statically exported shell path: /{locale}/organizers/detail/ */
export const ORGANIZER_DETAIL_SHELL_ID = 'detail';

export function organizerDetailHref(locale: string, id: string): string {
  return `/${locale}/organizers/${ORGANIZER_DETAIL_SHELL_ID}/?id=${encodeURIComponent(id)}`;
}

export function resolveOrganizerId(
  pathname: string,
  searchId: string | null | undefined,
  paramId?: string,
): string {
  const fromQuery = readCmsQueryValue(searchId);
  if (fromQuery) return fromQuery;

  const parts = pathname.split('/').filter(Boolean);
  const organizersIdx = parts.findIndex((part) => part === 'organizers');
  const fromPath = organizersIdx >= 0 ? readCmsQueryValue(parts[organizersIdx + 1]) : '';
  if (fromPath && fromPath !== ORGANIZER_DETAIL_SHELL_ID) {
    return fromPath;
  }

  const fromParam = readCmsQueryValue(paramId);
  if (fromParam && fromParam !== ORGANIZER_DETAIL_SHELL_ID) {
    return fromParam;
  }

  return '';
}
