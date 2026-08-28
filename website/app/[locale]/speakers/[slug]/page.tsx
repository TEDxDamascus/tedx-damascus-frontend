import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { SpeakerDetailClient } from '@/components/speakers/SpeakerDetailClient';
import { Footer } from '@/components/layout';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// One HTML shell per locale (`detail`). CMS slugs are not known at build
// time, and `output: "export"` cannot emit a folder per speaker after
// deploy. SpeakerDetailClient reads ?slug= client-side (same pattern as
// wall question detail). Pretty URLs /{locale}/speakers/{slug}/ are
// redirected onto this shell by public/.htaccess on Hostinger.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'detail' }));
}

export default async function SpeakerDetailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense fallback={null}>
        <SpeakerDetailClient locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}
