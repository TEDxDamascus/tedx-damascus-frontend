import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { OurStory } from '@/components/about/our-story';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative">
      <OurStory locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
