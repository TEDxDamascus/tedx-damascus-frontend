import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { ArticleDetailClient } from '@/components/articles/ArticleDetailClient';
import { Metadata } from 'next';
import { buildLanguageAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'detail' }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return {
    title: locale === 'ar' ? 'المقال | TEDx Damascus' : 'Article | TEDx Damascus',
    alternates: buildLanguageAlternates(`/articles/${slug}`, locale),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <ArticleDetailClient locale={locale} />
    </Suspense>
  );
}
