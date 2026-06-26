"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";

interface MediaPartnerProps {
  locale: string;
}

export default function MediaPartner({ locale }: MediaPartnerProps) {
  const isRtl = locale === "ar";

  const mediaPartners = [
    {
      name: "Levant Network",
      logoUrl: "/images/partners/socialmedia.png",
      type: isRtl ? "بث تلفزيوني" : "BROADCASTING",
      btnText: isRtl ? "← غرفة الأخبار" : "NEWSROOM →",
      websiteUrl: "https://example.com",
      description: isRtl
        ? "الشريك الإعلامي الرسمي لتغطية الفعاليات الثقافية السورية."
        : "Official broadcasting partner for Syrian cultural events.",
    },
    {
      name: "Social Pulse",
      logoUrl: "/images/partners/earth.png",
      type: isRtl ? "إعلام رقمي" : "DIGITAL MEDIA",
      btnText: isRtl ? "← المنصة رقمية" : "PLATFORM →",
      websiteUrl: "https://example.com",
      description: isRtl
        ? "ربط الشباب السوري من خلال صناعة القصص الرقمية المؤثرة."
        : "Connecting youth through transformative digital storytelling.",
    },
    {
      name: "Vivid Vision",
      logoUrl: "/images/partners/Overlay.png",
      type: isRtl ? "محتوى بصري" : "VISUAL CONTENT",
      btnText: isRtl ? "← معرض الأعمال" : "PORTFOLIO →",
      websiteUrl: "https://example.com",
      description: isRtl
        ? "توثيق روح دمشق بأفلام سينمائية عالية الدقة."
        : "Capturing the essence of Damascus through high-fidelity cinema.",
    },
  ];

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شركاء الإعلام" : "MEDIA PARTNERS"}
        titleColor="text-[#EB0028]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 w-full">
        {mediaPartners.map((partner, index) => (
          <PartnerCard
            key={index}
            locale={locale}
            name={partner.name}
            description={partner.description}
            logoUrl={partner.logoUrl}
            bgIconUrl={partner.type}
            websiteUrl={partner.websiteUrl}
            websiteBtnText={partner.btnText}
            showProfileBtn={false}
            showWebsiteBtn={true}
            showBadge={false}
            showWebsiteBtnBorder={false}
            cardLayoutClasses="flex flex-col items-start justify-between"
            cardBgColor="bg-[#1A1A1A]"
            cardPadding="p-6 sm:p-5"
            cardGap="gap-2"
            cardMinHeight="min-h-[250px]"
            logoContainerSize="w-[90px] h-[45px]"
            logoContainerBg="bg-transparent"
            logoImageFit="object-contain"
            logoLayoutClasses="!justify-start"
            contentLayoutClasses="w-full flex flex-col text-start items-start flex-grow mt-3"
            titleSize="text-lg sm:text-[20px] font-semibold text-white"
            descriptionSize="text-xs sm:text-[14px]"
            descriptionColor="text-neutral-500"
            websiteBtnBg="bg-transparent text-[#EB0028] font-bold p-0 hover:text-[#EB0028]/80 transition-colors"
            btnTextSize="text-[13px] uppercase tracking-wider"
            btnPadding="py-1"
            iconOpacity="opacity-100"
            bgIconTextSize="text-[9px] sm:text-[9px]"
            bgIconPosition={`top-6 ${isRtl ? "left-6" : "right-6"}`}
          />
        ))}
      </div>
    </section>
  );
}
