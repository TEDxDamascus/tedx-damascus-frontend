import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { VolunteerForm } from '@/components/forms/VolunteerForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VolunteerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VolunteerForm locale={locale} />;
}
