// app/[locale]/partners/page.tsx

import { Suspense } from "react";
import type { Metadata } from "next";
import { routing } from "@/routing";
import { buildLanguageAlternates } from "@/lib/seo";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildLanguageAlternates("/partners", locale) };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Suspense fallback={null}>
      <PartnersPageClient locale={locale} />
    </Suspense>
  );
}