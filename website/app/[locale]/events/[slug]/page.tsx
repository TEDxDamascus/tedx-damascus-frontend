import { routing } from '@/routing';
import { EventDetailsClient } from '@/components/events/EventDetailsClient';
import { Footer } from '@/components/layout';
import { fetchWithRetry } from '@/lib/api/fetch-retry';

const API_BASE_URL = 'https://api.tedxdamascus.sy';
const FALLBACK_SLUGS = ['from-war-to-big-dreams', 'tedx-damascus-2026'];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

type LocaleString = string | { en?: string; ar?: string };

function extractEnTitle(value: LocaleString | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.en ?? value.ar ?? '';
}

export async function generateStaticParams() {
  let slugs = [...FALLBACK_SLUGS];
  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/events`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const events: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      const apiSlugs = events
        .map((e: any) => {
          if (e.slug && typeof e.slug === 'string') return e.slug;
          const enTitle = extractEnTitle(e.title ?? e.name);
          return enTitle ? toSlug(enTitle) : String(e._id ?? e.id ?? '');
        })
        .filter(Boolean);
      if (apiSlugs.length > 0) {
        slugs = [...new Set([...FALLBACK_SLUGS, ...apiSlugs])];
      }
    }
  } catch { /* use fallback slugs */ }

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <main>
      <EventDetailsClient locale={locale} slug={slug} />
      <Footer locale={locale} />
    </main>
  );
}
