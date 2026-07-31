import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';
import { FORM_SLUGS } from '@/lib/forms-routes';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    FORM_SLUGS.map((slug) => ({ locale, slug })),
  );
}

// Forms are Arabic-only — any locale other than "ar" redirects to the Arabic URL
// so the whole page (nav, footer, form) renders in one consistent language.
export default async function DynamicFormPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== 'ar') {
    redirect(`/ar/forms/${slug}`);
  }
  setRequestLocale('ar');
  return <DynamicFormRenderer slug={slug} locale="ar" />;
}
