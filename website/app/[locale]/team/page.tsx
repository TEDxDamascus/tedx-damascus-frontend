import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { TeamPage } from '@/components/team/TeamPage';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

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
