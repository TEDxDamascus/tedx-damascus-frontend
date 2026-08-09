import { notFound } from "next/navigation";
import PartnerDetails from "@/components/partner/PartnerDetails";
import { mapPartnerToDetailsView } from "@/mappers/partner.mapper";

interface PageProps {
  params: Promise<{
    locale: "en" | "ar";
    slug: string;
  }>;
}

const BASE_URL = "https://api.tedxdamascus.sy";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/partners`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch partners");
    }

    const data = await res.json();
    const partners = data.data || [];

    if (!Array.isArray(partners)) {
      throw new Error("API did not return array");
    }

    return partners
      .flatMap((p: any) => [
        { locale: "en", slug: p.slug?.en?.trim() },
        { locale: "ar", slug: p.slug?.ar?.trim() },
      ])
      .filter((entry) => Boolean(entry.slug));
  } catch (error) {
    console.error("Error generating static params for partners:", error);
    return [];
  }
}

async function getPartner(slug: string) {
  const res = await fetch(`${BASE_URL}/partners`);

  if (!res.ok) {
    throw new Error("Failed to fetch partners");
  }

  const data = await res.json();

  const partners = data.data || [];

  if (!Array.isArray(partners)) {
    throw new Error("API did not return array");
  }

  const normalizedSlug = slug?.trim().toLowerCase();

  const partner = partners.find((p: any) => {
    return (
      p.slug?.en?.trim().toLowerCase() === normalizedSlug ||
      p.slug?.ar?.trim() === slug?.trim()
    );
  });

  return partner;
}

export default async function PartnerDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const partner = await getPartner(slug);

  if (!partner) {
    notFound();
  }

  const mappedPartner = mapPartnerToDetailsView(partner, locale);

  return <PartnerDetails locale={locale} slug={slug} partner={mappedPartner} />;
}
