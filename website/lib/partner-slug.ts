import { toPathSafeSlug } from '@/lib/utils';

/** Statically exported shell path: /{locale}/partner/detail/ */
export const PARTNER_DETAIL_SHELL_SLUG = 'detail';

/** Next trailingSlash can append `/` onto the query value (`?slug=foo/`). */
export function normalizePartnerSlug(raw: string): string {
  let value = raw.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    /* already decoded */
  }
  return toPathSafeSlug(value.replace(/\/+$/, '')).toLowerCase();
}

export function partnerDetailHref(locale: string, slug: string): string {
  const safe = toPathSafeSlug(slug.trim().replace(/\/+$/, ''));
  if (!safe) return '#';
  return `/${locale}/partner/${PARTNER_DETAIL_SHELL_SLUG}/?slug=${encodeURIComponent(safe)}`;
}

export function partnerSlugFromField(slug: unknown, locale: string): string {
  if (typeof slug === 'string') return toPathSafeSlug(slug);
  if (slug && typeof slug === 'object') {
    const obj = slug as { en?: string; ar?: string };
    const raw = (locale === 'ar' ? obj.ar : obj.en) || obj.en || obj.ar || '';
    return toPathSafeSlug(raw);
  }
  return '';
}

export function resolvePartnerSlug(
  pathname: string,
  searchSlug: string | null | undefined,
  paramSlug?: string,
): string {
  const fromQuery = searchSlug?.trim();
  if (fromQuery) return normalizePartnerSlug(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const partnerIdx = parts.findIndex((part) => part === 'partner');
  const fromPath = partnerIdx >= 0 ? parts[partnerIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? normalizePartnerSlug(fromPath) : '';
  if (decodedPath && decodedPath !== PARTNER_DETAIL_SHELL_SLUG) {
    return decodedPath;
  }

  if (paramSlug && paramSlug !== PARTNER_DETAIL_SHELL_SLUG) {
    return normalizePartnerSlug(paramSlug);
  }

  return '';
}
