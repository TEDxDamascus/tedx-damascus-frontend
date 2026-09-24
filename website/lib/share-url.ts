/**
 * Facebook / LinkedIn / WhatsApp scrape the shared URL without running JS.
 * Profile pages live at /{locale}/{section}/detail/?slug|id=, so convert
 * that to a pretty /{locale}/{section}/{key}/ URL for crawlers + previews.
 */
const PROFILE_SECTIONS = new Set(['speakers', 'team', 'organizers', 'articles']);

export function canonicalProfileShareUrl(href: string): string {
  try {
    const url = new URL(href);
    const parts = url.pathname.split('/').filter(Boolean);
    const [locale, section, shell] = parts;

    if (
      (locale === 'en' || locale === 'ar') &&
      section &&
      PROFILE_SECTIONS.has(section) &&
      shell === 'detail'
    ) {
      const key = url.searchParams.get('slug') || url.searchParams.get('id');
      if (key) {
        url.pathname = `/${locale}/${section}/${encodeURIComponent(key)}/`;
        url.search = '';
        url.hash = '';
        return url.toString();
      }
    }

    url.hash = '';
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Instagram has no web sharer. On phones the system sheet can hand the article
 * URL to Instagram; elsewhere the link is copied and Instagram opens so it can be pasted.
 * The preview (title + image) still comes from og.php when that URL is opened.
 */
export async function shareArticleOnInstagram(url: string, title: string): Promise<void> {
  const onPhone =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  if (onPhone && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text: title, url });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
  } catch {
    /* clipboard blocked */
  }

  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
}
