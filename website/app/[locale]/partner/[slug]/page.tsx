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
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch partners");
    }

    const data = await res.json();
    const partners = data.data || [];

    if (!Array.isArray(partners)) {
      throw new Error("API did not return array");
    }

    return partners.flatMap((partner: any) => {
      const params = [];

      if (partner.slug?.en?.trim()) {
        params.push({
          locale: "en" as const,
          slug: partner.slug.en.trim(),
        });
      }

      if (partner.slug?.ar?.trim()) {
        params.push({
          locale: "ar" as const,
          slug: partner.slug.ar.trim(),
        });
      }

      return params;
    });
  } catch (error) {
    console.error(
      "Error generating static params for partners:",
      error
    );

    throw error;
  }
}

async function getPartner(slug: string) {
  const res = await fetch(`${BASE_URL}/partners`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch partners");
  }

  const data = await res.json();
  const partners = data.data || [];

  if (!Array.isArray(partners)) {
    throw new Error("API did not return array");
  }

  const decodedSlug = decodeURIComponent(slug).trim();
  const normalizedSlug = decodedSlug.toLowerCase();

  return partners.find((partner: any) => {
    const enSlug = partner.slug?.en
      ?.trim()
      .toLowerCase();

    const arSlug = partner.slug?.ar
      ?.trim();

    return (
      enSlug === normalizedSlug ||
      arSlug === decodedSlug
    );
  });
}

export default async function PartnerDetailsPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;

  const partner = await getPartner(slug);

  if (!partner) {
    notFound();
  }

  const mappedPartner = mapPartnerToDetailsView(
    partner,
    locale
  );

  return (
    <PartnerDetails
      locale={locale}
      slug={slug}
      partner={mappedPartner}
    />
  );
}