import { routing } from '@/routing';
import { EventDetailsClient } from '@/components/events/EventDetailsClient';
import { Footer } from '@/components/layout';

const API_BASE_URL = 'https://api.tedxdamascus.sy';
const FALLBACK_SLUGS = ['from-war-to-big-dreams', 'tedx-damascus-2026'];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  let slugs = [...FALLBACK_SLUGS];
  try {
    const res = await fetch(`${API_BASE_URL}/events`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const events: any[] = Array.isArray(data) ? data : (data?.data ?? []);
      const apiSlugs = events
        .map((e: any) => e.slug ?? toSlug(e.title ?? e.name ?? ''))
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
