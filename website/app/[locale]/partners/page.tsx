// app/[locale]/partners/page.tsx

import { Suspense } from "react";
import { routing } from "@/routing";
import PartnersPageClient from "@/components/partners/PartnersPageClient";

type Locale = "en" | "ar";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Suspense fallback={null}>
      <PartnersPageClient locale={locale} />
    </Suspense>
  );
}