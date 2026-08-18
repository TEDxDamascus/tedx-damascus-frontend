"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { partnersApi, PartnerData, PartnerViewData } from "@/lib/api/partners";
import { getLang } from "@/mappers/partner.mapper";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PartnersHero from "@/components/partners/PartnersHero";
import BecomePartner from "@/components/partners/BecomePartner";
import DiamondPartner from "./DiamondPartner";
import GoldenPartner from "./GoldenPartner";
import SilverPartner from "./SilverPartner";
import DynamicPartners from "./DynamicPartners";

interface Props { locale: "en" | "ar"; }

const formatPartner = (
  partner: PartnerData,
  locale: "en" | "ar",
): PartnerViewData => {
  const name =
    typeof partner.name === "object"
      ? partner.name?.[locale] || partner.name?.en || ""
      : partner.name || "";

  const slug =
    typeof partner.slug === "object" ? partner.slug?.[locale] || partner.slug?.en || "" : partner.slug || "";

  const short_description =
    typeof partner.short_description === "object" ? partner.short_description?.[locale] || partner.short_description?.en || "" : partner.short_description || "";

  const long_description =
    typeof partner.long_description === "object" ? partner.long_description?.[locale] || partner.long_description?.en || "" : partner.long_description || "";

  const tierName = partner.tier?.name?.trim() || "";
  const partnerType = partner.partner_ship_type?.trim() || tierName || "";
  const cardSize = partner.custom_card_size || partner.tier?.size || partner.tier?.custom_card_size;

  return {
    _id: partner._id,
    name,
    slug,
    partner_ship_type: partnerType,
    custom_card_size: cardSize,
    year: partner.year,
    short_description,
    long_description,
    social_links: partner.social_links || [],
    image: partner.image,
    tier: {
      type: partner.tier?.type,
      name: tierName,
      size: partner.tier?.size,
      custom_card_size: partner.tier?.custom_card_size,
    },
    contact_info: {
      address: getLang(partner.contact_info?.address, locale),
      phone: partner.contact_info?.phone || "",
      email: partner.contact_info?.email || "",
    },
    services: (partner.services || []).map((s) => ({
      title: s.title,
      description: getLang(s.description, locale),
    })),
  };
};

export default function PartnersPageClient({ locale }: Props) {
  const yearParam = useSearchParams().get("year");
  const [allPartners, setAllPartners] = useState<PartnerViewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnersApi
      .getAll()
      .then((res: any) => {
        const rawData = res?.data ?? [];

        const formatted = rawData.map((p: PartnerData) =>
          formatPartner(p, locale),
        );

        setAllPartners(formatted);
      })
      .catch((err) => console.error("Failed to load partners:", err))
      .finally(() => setLoading(false));
  }, [locale]);

  const yearFiltered = yearParam
    ? allPartners.filter((p) => String(p.year ?? "") === yearParam)
    : allPartners;

  const getByTier = (tier: string) =>
    yearFiltered.filter((p) => {
      const requestedTier = tier.toLowerCase().trim();

      const partnerType = p.partner_ship_type?.toLowerCase().trim() || "";

      const tierName = p.tier?.name?.toLowerCase().trim() || "";

      const tierType = p.tier?.type?.toLowerCase().trim() || "";

      if (requestedTier === "diamond") {
        return (
          partnerType === "diamond" ||
          tierName === "diamond" ||
          tierType === "diamond" ||
          tierName === "platinum" ||
          tierType === "platinum"
        );
      }
      return partnerType === requestedTier;
    });

  const diamondPartners = getByTier("diamond");
  const goldenPartners = getByTier("gold");
  const silverPartners = getByTier("silver");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#101010] text-gray-400">
        Loading TEDxDamascus Partners...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] text-white flex flex-col justify-between">
      <Navbar locale={locale} />

      <PartnersHero locale={locale} />

      <div className="mx-auto w-full px-6 md:px-12 pb-20 flex flex-col gap-12">
        <DiamondPartner locale={locale} partners={diamondPartners} />

        <GoldenPartner locale={locale} partners={goldenPartners} />

        <SilverPartner locale={locale} partners={silverPartners} />

        <DynamicPartners locale={locale} partners={yearFiltered} />

        <BecomePartner locale={locale} />
      </div>

      <Footer locale={locale} />
    </main>
  );
}
