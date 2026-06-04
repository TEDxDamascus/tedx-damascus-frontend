import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { SpeakerForm } from '@/components/forms/SpeakerForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SpeakerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SpeakerForm locale={locale} />;
}
