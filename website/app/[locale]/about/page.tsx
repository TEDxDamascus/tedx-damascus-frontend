import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { buildLanguageAlternates } from '@/lib/seo';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutContent } from '@/components/about/AboutContent';
import StatsSection from '@/components/about/StatsSection';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildLanguageAlternates('/about', locale) };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative">
      <AboutHero locale={locale} />
      <AboutContent locale={locale} />
      <StatsSection locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
