import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { MemberDetail } from '@/components/team/MemberDetail';
import { TEAM_SLUGS } from '@/components/team/data';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TEAM_SLUGS.map((slug) => ({ locale, slug })));
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TeamMemberPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const index = TEAM_SLUGS.indexOf(slug);
  if (index === -1) notFound();

  return (
    <main className="relative">
      <MemberDetail locale={locale} index={index + 1} />
      <Footer locale={locale} />
    </main>
  );
}
