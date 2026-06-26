import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import ComingSoonClient from '../coming-soon/ComingSoonClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoonClient locale={locale} />;
}
