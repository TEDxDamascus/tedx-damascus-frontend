import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { OrganizerDetailClient } from '@/components/organizer/OrganizerDetailClient';
import { Footer } from '@/components/layout/Footer';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// One HTML shell per locale (`detail`). CMS organizer ids are not known at
// build time, and `output: "export"` cannot emit a folder per organizer after
// deploy. OrganizerDetailClient reads ?id= client-side (same pattern as
// speakers / events / wall). Pretty URLs /{locale}/organizers/{id}/ are
// redirected onto this shell by public/.htaccess on Hostinger.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, id: 'detail' }));
}

export default async function OrganizerDetailsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#101010]">
      <Suspense fallback={null}>
        <OrganizerDetailClient locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}
