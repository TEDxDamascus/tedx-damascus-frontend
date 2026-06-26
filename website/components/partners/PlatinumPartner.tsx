"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";

interface PlatinumPartnerProps {
  locale: string;
}

export default function PlatinumPartner({ locale }: PlatinumPartnerProps) {
  const isRtl = locale === "ar";

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك بلاتيني" : "PLATINUM PARTNER"}
        titleColor="text-[#EB0028]"
      />

      <div className="mt-6">
        <PartnerCard
          locale={locale}
          bgIconUrl="/images/partners/diamond.png"
          showBadge={true}
          tierBadge={isRtl ? "الفئة النخبوية" : "ELITE TIER"}
          name="Damascus Tech Hub"
          description={
            isRtl
              ? "يقود Damascus Tech Hub التحول الرقمي في بلاد الشام، ويوفر البنية التحتية لمبتكري الغد. إن التزامهم بالتميز التكنولوجي يعكس مهمتنا في نشر الأفكار التحولية."
              : "Driving the digital transformation of the Levant, Damascus Tech Hub provides the infrastructure for tomorrow's visionaries. Their commitment to technological excellence mirrors our mission to spread transformative ideas."
          }
          logoUrl="/images/partners/PlatinumPartnerLogo.png"
          websiteUrl="https://example.com"
          profileUrl={`/${locale}/partners/damascus-tech-hub`}
          showProfileBtn={true}
          showWebsiteBtn={true}
          showWebsiteBtnBorder={true}
          cardLayoutClasses="flex flex-col md:grid md:grid-cols-3 items-stretch overflow-hidden"
          logoContainerSize="w-full h-[180px] sm:h-[220px] md:h-auto p-4 sm:p-8 md:p-16 flex items-center justify-center min-h-[180px] md:min-h-full"
          contentLayoutClasses="flex flex-col justify-center w-full text-center items-center md:text-start md:items-start md:col-span-2"
          cardMinHeight="min-h-auto md:min-h-[450px]"
          cardPadding="p-6 sm:p-10 md:p-14"
          cardGap="gap-6 sm:gap-8 md:gap-16"
          cardBgColor="bg-[#151515]"
          logoContainerBg="bg-[#222222]"
          logoImageFit="object-contain"
          profileBtnBg="bg-white text-black border border-white hover:bg-white/80"
          websiteBtnBg="bg-transparent text-white border border-white/40 hover:bg-white/5 hover:border-white"
          btnPadding="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
          btnTextSize="text-xs sm:text-sm md:text-base"
          titleSize="text-2xl sm:text-4xl md:text-5xl"
          descriptionSize="text-sm sm:text-lg md:text-[22px]"
          titleColor="text-white"
          descriptionColor="text-[#E9BCB8]/60"
          
          /* 🌟 التعديل الجديد: خلينها تختفي فقط على الموبايل الصغير وتظهر من أول الـ sm (640px) لحتى تبين عندك على حجم 999px فوراً */
          iconSize="hidden sm:block w-20 h-20 md:w-30 md:h-30"
          iconOpacity="opacity-15"
          bgIconPosition={`top-6 ${isRtl ? "left-6" : "right-6"}`}
        />
      </div>
    </section>
  );
}