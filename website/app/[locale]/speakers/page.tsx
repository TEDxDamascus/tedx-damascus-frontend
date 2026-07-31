import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { SpeakersPageClient } from '@/components/speakers/SpeakersPageClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SpeakersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpeakersPageClient locale={locale} />;
}
