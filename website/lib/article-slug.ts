import { toPathSafeSlug } from '@/lib/utils';

/** Statically exported shell path: /{locale}/articles/detail/ */
export const ARTICLE_DETAIL_SHELL_SLUG = 'detail';

export function articleDetailHref(locale: string, slug: string): string {
  const safe = toPathSafeSlug(slug.trim());
  if (!safe) return '#';
  return `/${locale}/articles/${ARTICLE_DETAIL_SHELL_SLUG}/?slug=${encodeURIComponent(safe)}`;
}

export function resolveArticleSlug(
  pathname: string,
  searchSlug: string | null | undefined,
  paramSlug?: string,
): string {
  const fromQuery = searchSlug?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const articlesIdx = parts.findIndex((part) => part === 'articles');
  const fromPath = articlesIdx >= 0 ? parts[articlesIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? decodeURIComponent(fromPath) : '';
  if (decodedPath && decodedPath !== ARTICLE_DETAIL_SHELL_SLUG) {
    return decodedPath;
  }

  if (paramSlug && paramSlug !== ARTICLE_DETAIL_SHELL_SLUG) {
    return paramSlug;
  }

  return '';
}
