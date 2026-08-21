"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";
import { PartnerViewData } from "@/lib/api/partners";
import { normalizeTier } from "@/lib/api/partners";
import { getImageUrl } from "@/lib/api/client";


interface SilverPartnerProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function SilverPartner({
  locale,
  partners,
}: SilverPartnerProps) {
  const isRtl = locale === "ar";

const displayPartners = (partners || []).filter((p) => {
  const type = normalizeTier(p.partner_ship_type || p.tier?.name);
  return type === "silver";
});

  if (displayPartners.length === 0) return null;

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك فضي" : "SILVER TIER"}
        titleColor="text-neutral-500"
        locale={locale}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-6 w-full">
        {displayPartners.map((partner) => (
          <PartnerCard
            key={partner._id}
            locale={locale}
            name={partner.name}
            description={partner.short_description ?? ""}
            logoUrl={
              partner.image
                ? getImageUrl(partner.image)
                : "https://placehold.co/300x300/222/fff?text=Logo"
            }
            websiteUrl={partner.social_links?.[0] ?? "#"}
            profileUrl={
              partner.slug
                ? `/${locale}/partner/${partner.slug}`
                : "#"
            }
            bgIconUrl={isRtl ? "شريك فضي" : "Silver Tier"}

            showProfileBtn={false}
            showWebsiteBtn={true}
            showBadge={false}
            showWebsiteBtnBorder={false}

            cardLayoutClasses="flex flex-col items-start justify-between"
            cardBgColor="bg-[#1A1A1A]"
            cardPadding="p-5 sm:p-8"
            cardGap="gap-2"
            cardMinHeight="min-h-[260px]"

            logoContainerSize="w-[100px] h-[100px]"
            logoContainerBg="bg-[#222222]"
            logoImageFit="object-contain p-2"

            contentLayoutClasses="w-full flex flex-col text-start items-start flex-grow mt-2"

            titleSize="text-lg sm:text-[22px] font-semibold"
            descriptionSize="text-xs sm:text-[16px]"
            descriptionColor="text-[#E9BCB8]/60"

            websiteBtnBg="bg-transparent text-[#EB0028] font-bold p-0 hover:text-[#EB0028]/80 transition-colors"
            btnTextSize="text-[14px] uppercase tracking-wider"
            btnPadding="py-1"

            iconOpacity="opacity-100"
            bgIconTextSize="text-[8px] sm:text-[10px]"
            bgIconPosition={`top-20 ${isRtl ? "left-8" : "right-8"}`}

            websiteBtnText={isRtl ? "زيارة الموقع" : "VISIT SITE"}
          />
        ))}
      </div>
    </section>
  );
}