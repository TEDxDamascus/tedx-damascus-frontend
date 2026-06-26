import PartnerDetails from "@/components/partner/PartnerDetails";
import React from "react";


interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}
export async function generateStaticParams() {
  return [
    { locale: "en", slug: "sham-telecom" },
    { locale: "ar", slug: "sham-telecom" },
  ];
}

export default async function PartnerDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;

  return <PartnerDetails locale={locale} slug={slug} />;
}
