import { readCmsQueryValue } from '@/lib/utils';

/** Statically exported shell path: /{locale}/speakers/detail/ */
export const SPEAKER_DETAIL_SHELL_SLUG = 'detail';

export function speakerDetailHref(locale: string, slug: string): string {
  return `/${locale}/speakers/${SPEAKER_DETAIL_SHELL_SLUG}/?slug=${encodeURIComponent(slug)}`;
}

export function resolveSpeakerSlug(
  pathname: string,
  searchSlug: string | null | undefined,
  paramSlug?: string,
): string {
  const fromQuery = readCmsQueryValue(searchSlug);
  if (fromQuery) return fromQuery;

  const parts = pathname.split('/').filter(Boolean);
  const speakersIdx = parts.findIndex((part) => part === 'speakers');
  const fromPath = speakersIdx >= 0 ? readCmsQueryValue(parts[speakersIdx + 1]) : '';
  if (fromPath && fromPath !== SPEAKER_DETAIL_SHELL_SLUG) {
    return fromPath;
  }

  const fromParam = readCmsQueryValue(paramSlug);
  if (fromParam && fromParam !== SPEAKER_DETAIL_SHELL_SLUG) {
    return fromParam;
  }

  return '';
}
