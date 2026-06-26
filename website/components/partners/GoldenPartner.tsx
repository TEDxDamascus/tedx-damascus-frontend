"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";

interface GoldenPartnerProps {
  locale: string;
}

export default function GoldenPartner({ locale }: GoldenPartnerProps) {
  const isRtl = locale === "ar";

  const goldPartners = [
    {
      name: "Creative Levant",
      logoUrl: "/images/partners/GoldPartnerLogo1.png", // 👈 سيقرأها الكارد كـ Image
      bgIconUrl: "/images/partners/Border.png",
      websiteUrl: "https://example.com",
      profileUrl: `/${locale}/partners/creative-levant`,
      description: isRtl
        ? "مؤسسة إعلامية رائدة متخصصة في سرد القصص التي تكسر الفجوة بين التاريخ القديم والابتكار الحديث في العالم العربي."
        : "A boutique media powerhouse specializing in storytelling that bridges the gap between ancient history and modern innovation across the Arab world.",
    },
    {
      name: "Urban Visions",
      logoUrl: "/images/partners/GoldPartnerLogo2.png", 
      bgIconUrl: "/images/partners/Border.png",
      websiteUrl: "https://example.com",
      profileUrl: `/${locale}/partners/urban-visions`,
      description: isRtl
        ? "ريادة التطوير العمراني المستدام في سوريا من خلال حلول معمارية مبتكرة ومبادئ تصميم تتميز بالتركيز على المجتمع."
        : "Pioneering sustainable urban development in Syria through innovative architectural solutions and community-centric design principles.",
    },
  ];

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك ذهبي" : "GOLD PARTNERS"}
        titleColor="text-[#EB0028]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-6 w-full">
        {goldPartners.map((partner, index) => (
          <PartnerCard
            key={index}
            locale={locale}
            name={partner.name}
            description={partner.description}
            logoUrl={partner.logoUrl} 
            bgIconUrl={partner.bgIconUrl}
            websiteUrl={partner.websiteUrl}
            profileUrl={partner.profileUrl}
            showProfileBtn={true}
            showWebsiteBtn={true}
            showBadge={false}
            showWebsiteBtnBorder={false}
            cardLayoutClasses="flex flex-col items-start justify-between"
            cardBgColor="bg-[#151515]"
            cardPadding="p-8 sm:px-20 sm:py-15"
            cardGap="gap-8"
            cardMinHeight="min-h-[300px]"
            logoContainerSize="w-[160px] h-[160px] sm:w-[150px] sm:h-[150px]"
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
            iconSize="w-20 h-20"
            iconOpacity="opacity-60"
            bgIconPosition={`top-6 ${isRtl ? "left-6" : "right-6"}`}
            websiteBtnText={isRtl ? "زيارة الموقع" : "VISIT SITE"}
          />
        ))}
      </div>
    </section>
  );
}
