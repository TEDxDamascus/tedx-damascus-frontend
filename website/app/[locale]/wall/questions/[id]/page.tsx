import { routing } from '@/routing';
import { QuestionDetailClient } from '@/components/wall/QuestionDetailClient';

const API_BASE_URL = 'https://api.tedxdamascus.sy';

// Always returns at least one entry per locale so output: export never sees an
// empty list. Real IDs are added when the API is reachable at build time.
// dynamicParams stays true (default) so the dev server renders any ID.
export async function generateStaticParams() {
  const placeholder = routing.locales.map((locale) => ({ locale, id: '_' }));
  try {
    const res = await fetch(`${API_BASE_URL}/wall-cards/questions?limit=100`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const items: any[] = data?.data?.items ?? [];
      const ids = items.map((q: any) => String(q.id)).filter(Boolean);
      if (ids.length > 0) {
        return routing.locales.flatMap((locale) =>
          ids.map((id) => ({ locale, id }))
        );
      }
    }
  } catch { /* fall through to placeholder */ }

  return placeholder;
}

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function QuestionDetailPage({ params }: Props) {
  const { locale, id } = await params;
  return <QuestionDetailClient locale={locale} questionId={id} />;
}
