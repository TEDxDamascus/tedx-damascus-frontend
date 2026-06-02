import { setRequestLocale, getTranslations } from 'next-intl/server';
import { EventsPageClient } from '@/components/events';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Events');

  return (
    <main className="min-h-screen bg-black">
      <EventsPageClient locale={locale} />
    </main>
  );
}
