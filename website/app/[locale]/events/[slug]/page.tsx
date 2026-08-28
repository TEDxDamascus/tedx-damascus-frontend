import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { EventDetailsClient } from '@/components/events/EventDetailsClient';
import { Footer } from '@/components/layout';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// One HTML shell per locale (`detail`). CMS event slugs are not known at
// build time, and `output: "export"` cannot emit a folder per event after
// deploy. EventDetailsClient reads ?slug= client-side (same pattern as
// speakers / wall questions). Pretty URLs /{locale}/events/{slug}/ are
// redirected onto this shell by public/.htaccess on Hostinger.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'detail' }));
}

export default async function EventDetailsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense fallback={null}>
        <EventDetailsClient locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}
