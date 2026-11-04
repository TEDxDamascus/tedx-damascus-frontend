import type { Metadata } from 'next';
import { routing } from '@/routing';
import { buildLanguageAlternates } from '@/lib/seo';
import { EventsPageClient } from '@/components/events/EventsPageClient';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildLanguageAlternates('/events', locale) };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  return <EventsPageClient locale={locale} />;
}
