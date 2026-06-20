import { EventsPageClient } from '@/components/events';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  return <EventsPageClient locale={locale} />;
}
