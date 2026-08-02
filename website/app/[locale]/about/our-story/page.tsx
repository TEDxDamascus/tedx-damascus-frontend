import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { OurStory } from '@/components/about/our-story';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OurStoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('OurStory');

  return (
    <main className="relative">
      <AboutHero locale={locale} titlePrefix={t('titlePrefix')} titleHighlight={t('titleHighlight')} />
      <OurStory locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
