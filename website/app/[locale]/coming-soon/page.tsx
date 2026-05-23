import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/proxy';
import ComingSoonClient from './ComingSoonClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ComingSoonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoonClient locale={locale} />;
}
