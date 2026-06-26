"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";

interface SilverPartnerProps {
  locale: string;
}

export default function SilverPartner({ locale }: SilverPartnerProps) {
  const isRtl = locale === "ar";

  const silverPartners = [
    {
      name: "Sky Solutions",
      logoUrl: "/images/partners/sky-icon.png",
      bgIconUrl: "Silver Tier", 
      websiteUrl: "https://example.com",
      description: isRtl
        ? "متخصصون في الحلول اللوجستية والبنية التحتية السحابية."
        : "Logistics and cloud infrastructure specialists.",
    },
    {
      name: "EduFuture",
      logoUrl: "/images/partners/edu-icon.png",
      bgIconUrl: "Silver Tier", 
      websiteUrl: "https://example.com",
      description: isRtl
        ? "تمكين الجيل القادم من الباحثين والطلاب السوريين."
        : "Empowering the next generation of Syrian scholars.",
    },
  ];

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك فضي" : "SILVER TIER"}
        titleColor="text-neutral-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-6 w-full">
        {silverPartners.map((partner, index) => (
          <PartnerCard
            key={index}
            locale={locale}
            name={partner.name}
            description={partner.description}
            logoUrl={partner.logoUrl}
            bgIconUrl={partner.bgIconUrl}
            websiteUrl={partner.websiteUrl}
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
            logoLayoutClasses=""
            contentLayoutClasses="w-full flex flex-col text-start items-start flex-grow mt-2"
            titleSize="text-lg sm:text-[22px] font-semibold"
            descriptionSize="text-xs sm:text-[16px]"
            descriptionColor="text-[#E9BCB8]/60"
            websiteBtnBg="bg-transparent text-[#EB0028] font-bold p-0 hover:text-[#EB0028]/80 transition-colors"
            btnTextSize="text-[14px] uppercase tracking-wider"
            btnPadding="py-1"
            iconOpacity="opacity-100"
            iconSize=""
            bgIconTextSize="text-[8px] sm:text-[10px]"
            bgIconPosition={`top-20 ${isRtl ? "left-8" : "right-8"}`}
          />
        ))}
      </div>
    </section>
  );
}
