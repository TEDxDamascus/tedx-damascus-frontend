import { notFound } from "next/navigation";
import PartnerDetails from "@/components/partner/PartnerDetails";
import { mapPartnerToDetailsView } from "@/mappers/partner.mapper";
import { toPathSafeSlug } from "@/lib/utils";
import { fetchWithRetry } from "@/lib/api/fetch-retry";

interface PageProps {
  params: Promise<{
    locale: "en" | "ar";
    slug: string;
  }>;
}

const BASE_URL = "https://api.tedxdamascus.sy";

export async function generateStaticParams() {
  const params: { locale: "en" | "ar"; slug: string }[] = [];

  try {
    const res = await fetchWithRetry(`${BASE_URL}/partners`, {
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

    for (const partner of partners) {
      if (partner.slug?.en?.trim()) {
        params.push({
          locale: "en",
          slug: toPathSafeSlug(partner.slug.en.trim()),
        });
      }

      if (partner.slug?.ar?.trim()) {
        params.push({
          locale: "ar",
          slug: toPathSafeSlug(partner.slug.ar.trim()),
        });
      }
    }
  } catch (error) {
    // Don't let a flaky/unreachable API at build time crash the whole
    // static export (that leaves no `out/` dir and fails deployment).
    console.error("Error generating static params for partners:", error);
  }

  // With `output: "export"`, Next/Turbopack treats an empty array from
  // generateStaticParams() as if the function were missing entirely and
  // hard-fails the whole build (a real page will never resolve to this
  // placeholder slug; it just 404s via `notFound()` below like any other
  // unknown slug would).
  if (params.length === 0) {
    params.push({ locale: "en", slug: "__none__" }, { locale: "ar", slug: "__none__" });
  }

  return params;
}

async function getPartner(slug: string) {
  // No try/catch here used to mean a single flaky request during this one
  // page's static generation could throw uncaught and crash the *entire*
  // build (same failure mode as the generateStaticParams bug above) — retry
  // first, and degrade to "not found" for this page alone on failure rather
  // than taking every other page down with it.
  try {
    const res = await fetchWithRetry(`${BASE_URL}/partners`, {
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
        ?.trim();
      const enSafeSlug = enSlug ? toPathSafeSlug(enSlug).toLowerCase() : undefined;

      const arSlug = partner.slug?.ar
        ?.trim();
      const arSafeSlug = arSlug ? toPathSafeSlug(arSlug) : undefined;

      return (
        enSafeSlug === normalizedSlug ||
        arSafeSlug === decodedSlug
      );
    });
  } catch (error) {
    console.error("Error fetching partner for detail page:", error);
    return undefined;
  }
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