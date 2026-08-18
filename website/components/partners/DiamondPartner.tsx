"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";
import { PartnerViewData } from "@/lib/api/partners";
import { normalizeTier } from "@/lib/api/partners";

interface DiamondPartnerProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function DiamondPartner({
  locale,
  partners,
}: DiamondPartnerProps) {
  const isRtl = locale === "ar";

  const cleanPartners = Array.isArray(partners) ? partners : [];

  const diamondPartners = cleanPartners.filter((p) => {
    const type = normalizeTier(p.partner_ship_type || p.tier?.name);
    return type === "diamond";
  });

  if (diamondPartners.length === 0) {
    return null;
  }

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك ماسي" : "DIAMOND PARTNER"}
        titleColor="text-[#EB0028]"
        locale={locale}
      />

      <div className="mt-6 flex flex-col gap-8">
        {diamondPartners.map((partner) => {
          const partnerName = partner.name || "";
          const partnerDesc = partner.short_description ?? "";
          const partnerSlug = partner.slug || "";
          const websiteUrl = partner.social_links?.[0] ?? "#";

          return (
            <PartnerCard
              key={partner._id}
              locale={locale}
              bgIconUrl={isRtl ? "شريك ماسي" : "Diamond Partner"}
              showBadge={true}
              tierBadge={isRtl ? "الفئة الماسية" : "DIAMOND TIER"}
              name={partnerName}
              description={partnerDesc}
              logoUrl={
                partner.image || "/images/partners/DiamondPartnerLogo.png"
              }
              websiteUrl={websiteUrl}
              profileUrl={`/${locale}/partner/${partnerSlug}`}
              showProfileBtn={true}
              showWebsiteBtn={true}
              showWebsiteBtnBorder={true}
              cardLayoutClasses="flex flex-col md:grid md:grid-cols-3 items-stretch overflow-hidden"
              logoContainerSize="
                w-full
                h-[160px] sm:h-[190px] md:h-[220px]
                px-2 sm:px-3 md:px-4
                py-3 sm:py-4 md:py-5
                flex items-center justify-center
              "
              contentLayoutClasses={`flex flex-col justify-center w-full ${
                isRtl ? "text-right items-start" : "text-left items-start"
              } md:col-span-2`}
              cardMinHeight="min-h-auto md:min-h-[420px]"
              cardPadding="p-3 sm:p-6 md:p-10"
              cardGap="gap-5 sm:gap-6 md:gap-11"
              cardBgColor="bg-[#151515]"
              logoContainerBg="bg-[#222222]"
              logoImageFit="object-contain w-[90%] h-[90%] scale-105"
              profileBtnBg="bg-white text-black border border-white hover:bg-white/80"
              websiteBtnBg="bg-transparent text-white border border-white/40 "
              btnPadding="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
              btnTextSize="text-xs sm:text-sm md:text-base"
              titleSize="text-xl sm:text-4xl md:text-5xl"
              descriptionSize="text-xs sm:text-lg md:text-[22px]"
              titleColor="text-white"
              descriptionColor="text-[#E9BCB8]/60"
              bgIconTextSize="hidden sm:block text-base md:text-lg"
              iconOpacity="opacity-15"
              bgIconPosition={`top-4 ${isRtl ? "left-4" : "right-4"}`}
            />
          );
        })}
      </div>
    </section>
  );
}
