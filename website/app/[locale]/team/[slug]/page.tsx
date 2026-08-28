import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { MemberDetail } from '@/components/team/MemberDetail';
import { Footer } from '@/components/layout/Footer';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// One HTML shell per locale (`detail`). Team members come from the CMS and
// cannot be enumerated as static folders after deploy. MemberDetail reads
// ?id= and matches by `_id` (not list index). Old pretty URLs
// /{locale}/team/{slug}/ are redirected by public/.htaccess.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'detail' }));
}

export default async function TeamMemberPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative">
      <Suspense fallback={null}>
        <MemberDetail locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}
