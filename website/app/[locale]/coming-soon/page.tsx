import { setRequestLocale } from 'next-intl/server';
import ComingSoonClient from './ComingSoonClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ComingSoonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoonClient locale={locale} />;
}
