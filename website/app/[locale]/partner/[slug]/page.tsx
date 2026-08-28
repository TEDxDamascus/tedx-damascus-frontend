import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { PartnerDetailClient } from '@/components/partner/PartnerDetailClient';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// One HTML shell per locale (`detail`). CMS partner slugs are not known at
// build time. PartnerDetailClient reads ?slug= client-side. Pretty URLs
// /{locale}/partner/{slug}/ are redirected by public/.htaccess.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'detail' }));
}

export default async function PartnerDetailsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <PartnerDetailClient locale={locale} />
    </Suspense>
  );
}
