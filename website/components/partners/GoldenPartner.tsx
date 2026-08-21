"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";
import { PartnerViewData } from "@/lib/api/partners";
import { normalizeTier } from "@/lib/api/partners";
import { getImageUrl } from "@/lib/api/client";

interface GoldenPartnerProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function GoldenPartner({
  locale,
  partners,
}: GoldenPartnerProps) {
  const isRtl = locale === "ar";
  console.log("GOLDEN PARTNERS RECEIVED:", partners);
  const displayPartners = (partners || []).filter((p) => {
    const type = normalizeTier(p.partner_ship_type || p.tier?.name);
    return type === "gold";
  });

  const safeSlug = (slug: any) =>
    typeof slug === "string" ? slug : slug?.en || slug?.ar || "";

  if (displayPartners.length === 0) {
    return null;
  }

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك ذهبي" : "GOLD PARTNERS"}
        titleColor="text-[#EB0028]"
        locale={locale}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-6 w-full">
        {displayPartners.map((partner) => (
          <PartnerCard
            key={partner._id}
            locale={locale}
            name={partner.name}
            description={partner.short_description}
            logoUrl={getImageUrl(partner.image)}
            bgIconUrl={isRtl ? "شريك ذهبي" : "Gold Partner"}
            websiteUrl={partner.social_links?.[0] ?? "#"}
            profileUrl={`/${locale}/partner/${safeSlug(partner.slug)}`}
            showProfileBtn
            showWebsiteBtn
            showBadge={false}
            showWebsiteBtnBorder={false}
            cardLayoutClasses="flex flex-col items-start justify-between"
            cardBgColor="bg-[#151515]"
            cardPadding="p-8 sm:px-20 sm:py-15"
            cardGap="gap-8"
            cardMinHeight="min-h-[300px]"
            logoContainerSize="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]"
            logoContainerBg="bg-[#222222]"
            logoImageFit="object-cover"
            contentLayoutClasses="w-full flex flex-col text-start items-start flex-grow"
            titleSize="text-2xl sm:text-3xl"
            descriptionSize="text-lg sm:text-[20px]"
            descriptionColor="text-[#E9BCB8]/60"
            profileBtnBg="bg-transparent text-[#EB0028] border border-transparent hover:bg-white/5"
            websiteBtnBg="bg-transparent text-white border border-neutral-700 hover:border-neutral-500"
            btnTextSize="text-sm sm:text-lg"
            btnPadding="px-2 py-3.5"
            iconOpacity="opacity-100"
            bgIconTextSize="text-[6px] sm:text-[10px]"
            bgIconPosition={`top-20 ${isRtl ? "left-8" : "right-8"}`}
            websiteBtnText={isRtl ? "زيارة الموقع" : "VISIT SITE"}
          />
        ))}
      </div>
    </section>
  );
}
