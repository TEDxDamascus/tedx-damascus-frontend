"use client";

import React, { useEffect, useState } from "react";

import { partnersApi, PartnerData, PartnerViewData } from "@/lib/api/partners";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PartnersHero from "@/components/partners/PartnersHero";
import BecomePartner from "@/components/partners/BecomePartner";

import DiamondPartner from "./DiamondPartner";
import GoldenPartner from "./GoldenPartner";
import SilverPartner from "./SilverPartner";
import BronzePartner from "./BronzePartner";
import MediaPartner from "./MediaPartner";
import HealthPartner from "./HealthPartner";
import DynamicPartners from "./DynamicPartners";

interface Props {
  locale: "en" | "ar";
}

const formatPartner = (
  partner: PartnerData,
  locale: "en" | "ar",
): PartnerViewData => {
  const name =
    typeof partner.name === "object"
      ? partner.name?.[locale] || partner.name?.en || ""
      : partner.name || "";

  const slug =
    typeof partner.slug === "object"
      ? partner.slug?.[locale] || partner.slug?.en || ""
      : partner.slug || "";

  const short_description =
    typeof partner.short_description === "object"
      ? partner.short_description?.[locale] ||
        partner.short_description?.en ||
        ""
      : partner.short_description || "";

  const long_description =
    typeof partner.long_description === "object"
      ? partner.long_description?.[locale] ||
        partner.long_description?.en ||
        ""
      : partner.long_description || "";

  return {
    _id: partner._id,
    name,
    slug,
    partnership_type: partner.partnership_type?.trim(),
    short_description,
    long_description,
    social_links: partner.social_links || [],
    image: partner.image,
  };
};

export default function PartnersPageClient({ locale }: Props) {
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

  const getByTier = (tier: string) =>
    allPartners.filter((p) => {
      const type = p.partnership_type?.toLowerCase().trim();
      return type === tier.toLowerCase().trim();
    });

  const diamondPartners = getByTier("diamond");

  const goldenPartners = getByTier("gold");
  const silverPartners = getByTier("silver");
  const bronzePartners = getByTier("bronze");
  const mediaPartners = getByTier("media");
  const healthPartners = getByTier("health");

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
        <BronzePartner locale={locale} partners={bronzePartners} />
        <MediaPartner locale={locale} partners={mediaPartners} />
        <HealthPartner locale={locale} partners={healthPartners} />

        <DynamicPartners locale={locale} partnersData={allPartners} />

        <BecomePartner locale={locale} />
      </div>

      <Footer locale={locale} />
    </main>
  );
}