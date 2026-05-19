import { Suspense } from 'react';
import { HeroSection } from '@/components/home/hero';
import { CallForVoices } from '@/components/home/call-for-voices';
import { UsSection } from '@/components/home/us-section';
import { AddYourLine } from '@/components/home/add-your-line';
import { AboutTEDx } from '@/components/home/about-tedx';
import { Footer } from '@/components/layout/Footer';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="relative">
      <HeroSection locale={locale} />

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
