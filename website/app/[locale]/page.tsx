import { redirect } from 'next/navigation';
import { routing } from '@/proxy';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleRootPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}
