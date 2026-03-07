import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SpeakersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Speakers');

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Speaker list will be displayed here.
        </p>
      </section>
    </main>
  );
}
