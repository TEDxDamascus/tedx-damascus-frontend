import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/proxy';
import { CallForVoicesSection } from '@/components/events/CallForVoicesSection';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-page-bg">
      <CallForVoicesSection locale={locale} />
    </main>
  );
}
