import { routing } from '@/routing';
import { SpeakerDetailClient } from '@/components/speakers/SpeakerDetailClient';
import { Footer } from '@/components/layout';

const API_BASE_URL = 'https://api.tedxdamascus.sy';

interface ApiSpeakerStub {
  _id?: string;
  id?: string;
}

export async function generateStaticParams() {
  const ids: string[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/speakers`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const speakers: ApiSpeakerStub[] = Array.isArray(data) ? data : (data?.data ?? []);
      for (const s of speakers) {
        const id = String(s._id ?? s.id ?? '');
        if (id) ids.push(id);
      }
    }
  } catch { /* API unreachable at build time */ }

  return routing.locales.flatMap((locale) =>
    ids.map((slug) => ({ locale, slug }))
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
