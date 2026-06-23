import { redirect } from 'next/navigation';
import { routing } from '@/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WallQuestionsPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}
