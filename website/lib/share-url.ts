/**
 * Facebook / LinkedIn / WhatsApp scrape the shared URL without running JS.
 * Profile pages live at /{locale}/{section}/detail/?slug|id=, so convert
 * that to a pretty /{locale}/{section}/{key}/ URL for crawlers + previews.
 */
const PROFILE_SECTIONS = new Set(['speakers', 'team', 'organizers']);

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
