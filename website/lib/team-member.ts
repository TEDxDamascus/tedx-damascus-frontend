import { readCmsQueryValue } from '@/lib/utils';

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
  const fromQuery = readCmsQueryValue(searchId);
  if (fromQuery) return fromQuery;

  const parts = pathname.split('/').filter(Boolean);
  const teamIdx = parts.findIndex((part) => part === 'team');
  const fromPath = teamIdx >= 0 ? readCmsQueryValue(parts[teamIdx + 1]) : '';
  if (fromPath && fromPath !== TEAM_DETAIL_SHELL_SLUG) {
    return fromPath;
  }

  const fromParam = readCmsQueryValue(paramSlug);
  if (fromParam && fromParam !== TEAM_DETAIL_SHELL_SLUG) {
    return fromParam;
  }

  return '';
}

export function toMemberSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}
