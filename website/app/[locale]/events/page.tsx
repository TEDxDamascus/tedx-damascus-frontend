import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/proxy';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Events');

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Events will be displayed here.
        </p>
      </section>
    </main>
  );
}
