import { Suspense } from 'react';
import { routing } from '@/proxy';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
import { HeroSection } from '@/components/home/hero';
import { CallForVoices } from '@/components/home/call-for-voices';
import { UsSection } from '@/components/home/us-section';
import { AddYourLine } from '@/components/home/add-your-line';
import { AboutTEDx } from '@/components/home/about-tedx';
import { LatestEvents } from '@/components/home/latest-events/LatestEvents';
import { Footer } from '@/components/layout/Footer';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="relative">
      <HeroSection locale={locale} />

      <LatestEvents locale={locale} />

      <Suspense>
        <CallForVoices locale={locale} />
      </Suspense>

      <UsSection locale={locale} />
      <AddYourLine locale={locale} />

      <Suspense>
        <AboutTEDx locale={locale} />
      </Suspense>

      <Footer locale={locale} />
    </main>
  );
}
