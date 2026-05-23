import { setRequestLocale } from 'next-intl/server';
import { AnswersPageClient } from '@/components/answers';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AnswersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AnswersPageClient locale={locale} />;
}
