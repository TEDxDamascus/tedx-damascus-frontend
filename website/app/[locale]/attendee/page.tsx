import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { AttendeeForm } from '@/components/forms/AttendeeForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AttendeePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AttendeeForm locale={locale} />;
}
