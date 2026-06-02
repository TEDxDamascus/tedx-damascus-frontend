import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/proxy';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';

const FORM_SLUGS = ['speaker', 'attendee', 'volunteer', 'speakers-2026', '6a12eba6eb565d20493de36d'];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    FORM_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export default async function DynamicFormPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DynamicFormRenderer slug={slug} locale={locale} />;
}
