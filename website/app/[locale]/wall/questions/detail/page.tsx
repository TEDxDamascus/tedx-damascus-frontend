import { Suspense } from 'react';
import { routing } from '@/routing';
import { QuestionDetailClient } from '@/components/wall/QuestionDetailClient';

// Questions are user-submitted in real time, so their IDs can never be fully
// known at build time — generateStaticParams can't enumerate them for
// output: "export". Instead this is a single static shell (per locale);
// QuestionDetailClient reads ?id= client-side via useSearchParams and fetches
// the question by that ID, the same pattern used for the backend-driven
// /forms routes. output: "export" can't read searchParams server-side either
// (no server exists to evaluate the query string), so it must stay client-side.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QuestionDetailPage({ params }: Props) {
  const { locale } = await params;
  return (
    <Suspense fallback={null}>
      <QuestionDetailClient locale={locale} />
    </Suspense>
  );
}
