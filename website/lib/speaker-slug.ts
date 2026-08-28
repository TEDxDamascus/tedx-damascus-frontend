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
  const fromQuery = searchSlug?.trim();
  if (fromQuery) return decodeURIComponent(fromQuery);

  const parts = pathname.split('/').filter(Boolean);
  const speakersIdx = parts.findIndex((part) => part === 'speakers');
  const fromPath = speakersIdx >= 0 ? parts[speakersIdx + 1] ?? '' : '';
  const decodedPath = fromPath ? decodeURIComponent(fromPath) : '';
  if (decodedPath && decodedPath !== SPEAKER_DETAIL_SHELL_SLUG) {
    return decodedPath;
  }

  if (paramSlug && paramSlug !== SPEAKER_DETAIL_SHELL_SLUG) {
    return paramSlug;
  }

  return '';
}
