"use client";

import React from "react";
import CustomPartnerSection from "./CustomPartnerSection";
import {
  isFixedTier,
  normalizeTier,
  PartnerViewData,
} from "@/lib/api/partners";

interface DynamicPartnersProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function DynamicPartners({
  locale,
  partners = [],
}: DynamicPartnersProps) {
  const groupedPartners = partners.reduce(
    (acc, partner) => {
      const rawType =
        partner.partner_ship_type || partner.tier?.name || "";

      const type = normalizeTier(rawType);

      if (!type || type === "other" || isFixedTier(type)) {
        return acc;
      }

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push(partner);

      return acc;
    },
    {} as Record<string, PartnerViewData[]>,
  );

  const customTiers = Object.keys(groupedPartners);

  if (customTiers.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {customTiers.map((tierKey) => {
        const tierPartners = groupedPartners[tierKey];

        const formattedTitle =
          locale === "ar"
            ? `شريك ${tierKey}`
            : tierKey
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()) +
              " Partner";

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