import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { buildLanguageAlternates } from '@/lib/seo';
import { TeamPage } from '@/components/team/TeamPage';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildLanguageAlternates('/team', locale) };
}

export default async function Team({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="relative">
      <Suspense fallback={null}>
        <TeamPage locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}
