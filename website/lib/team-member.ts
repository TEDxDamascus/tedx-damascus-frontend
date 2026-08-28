/** Statically exported shell path: /{locale}/team/detail/ */
export const TEAM_DETAIL_SHELL_SLUG = 'detail';

export function teamMemberHref(locale: string, id: string): string {
  return `/${locale}/team/${TEAM_DETAIL_SHELL_SLUG}/?id=${encodeURIComponent(id)}`;
}

export function resolveTeamMemberKey(
  pathname: string,
  searchId: string | null | undefined,
  paramSlug?: string,
): string {
  const fromQuery = searchId?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const teamIdx = parts.findIndex((part) => part === 'team');
  const fromPath = teamIdx >= 0 ? parts[teamIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? decodeURIComponent(fromPath) : '';
  if (decodedPath && decodedPath !== TEAM_DETAIL_SHELL_SLUG) {
    return decodedPath;
  }

  if (paramSlug && paramSlug !== TEAM_DETAIL_SHELL_SLUG) {
    return paramSlug;
  }

  return '';
}

export function toMemberSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}
