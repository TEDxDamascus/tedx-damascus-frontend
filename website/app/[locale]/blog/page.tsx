import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export default function BlogPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('Blog');

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Blog posts will be displayed here.
        </p>
      </section>
    </main>
  );
}
