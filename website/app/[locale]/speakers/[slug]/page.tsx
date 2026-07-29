import { routing } from '@/routing';
import { SpeakerDetailClient } from '@/components/speakers/SpeakerDetailClient';
import { Footer } from '@/components/layout';

const API_BASE_URL = 'https://api.tedxdamascus.sy';

type LocaleString = string | { en?: string; ar?: string };

interface ApiSpeakerStub {
  _id?: string;
  id?: string;
  slug?: LocaleString;
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function extractSlug(s: ApiSpeakerStub): string {
  const rawId = String(s._id ?? s.id ?? '');
  if (s.slug) {
    const en = typeof s.slug === 'string' ? s.slug : (s.slug.en ?? '');
    if (en) return toSlug(en);
  }
  return rawId;
}

export async function generateStaticParams() {
  const slugs: string[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/speakers`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const speakers: ApiSpeakerStub[] = Array.isArray(data) ? data : (data?.data ?? []);
      for (const s of speakers) {
        const slug = extractSlug(s);
        if (slug) slugs.push(slug);
      }
    }
  } catch { /* API unreachable at build time */ }

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function SpeakerDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <main>
      <SpeakerDetailClient locale={locale} slug={slug} />
      <Footer locale={locale} />
    </main>
  );
}
