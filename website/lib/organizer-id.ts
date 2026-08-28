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
  const fromQuery = searchId?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const organizersIdx = parts.findIndex((part) => part === 'organizers');
  const fromPath = organizersIdx >= 0 ? parts[organizersIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? decodeURIComponent(fromPath) : '';
  if (decodedPath && decodedPath !== ORGANIZER_DETAIL_SHELL_ID) {
    return decodedPath;
  }

  if (paramId && paramId !== ORGANIZER_DETAIL_SHELL_ID) {
    return paramId;
  }

  return '';
}
