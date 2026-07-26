"use client";

import React from "react";
import CustomPartnerSection from "./CustomPartnerSection";
import { PartnerViewData } from "@/lib/api/partners";

interface DynamicPartnersProps {
  locale: "en" | "ar";
  partners: PartnerViewData[];
}

export default function DynamicPartners({
  locale,
  partners = [],
}: DynamicPartnersProps) {

  const groupedPartners = partners.reduce((acc, partner) => {
    const type = partner.partner_ship_type?.trim().toLowerCase() || "other";

    if (!acc[type]) acc[type] = [];

    acc[type].push(partner);

    return acc;
  }, {} as Record<string, PartnerViewData[]>);

  const mainTiers = ["diamond", "gold", "golden", "silver"];

  const customTiers = Object.keys(groupedPartners).filter(
    (tier) => !mainTiers.includes(tier)
  );

  if (customTiers.length === 0) return null;

  return (
    <div className="w-full">
      {customTiers.map((tierKey) => {
        const tierPartners = groupedPartners[tierKey];

        const formattedTitle =
  tierKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()) + " Partner";

        return (
          <CustomPartnerSection
            key={tierKey}
            locale={locale}
            title={formattedTitle}
            partners={tierPartners}
          />
        );
      })}
    </div>
  );
}