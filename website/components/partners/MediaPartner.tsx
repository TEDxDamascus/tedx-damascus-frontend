"use client";
import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";

interface Partner {
  _id: string;
  name: string;
  short_description?: string;
  image?: string;
  social_links?: string[];
  website_url?: string;
  slug?: string;
}

interface MediaPartnerProps {
  locale: "en" | "ar";
  partners?: Partner[];
}

export default function MediaPartner({ locale, partners }: MediaPartnerProps) {
  const isRtl = locale === "ar";
  const displayPartners = partners || [];

  if (displayPartners.length === 0) return null;

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شركاء الإعلام" : "MEDIA PARTNERS"}
        titleColor="text-[#EB0028]"
        locale={locale}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 w-full">
        {displayPartners.map((partner) => (
          <PartnerCard
            key={partner._id}
            locale={locale}
            name={partner.name}
            description={partner.short_description || ""}
            logoUrl={partner.image || "/images/partners/socialmedia.png"}
            websiteUrl={partner.social_links?.[0] || partner.website_url || "#"}
            bgIconUrl={isRtl ? "شريك إعلامي" : "MEDIA PARTNER"}
            websiteBtnText={isRtl ? "زيارة الموقع" : "VISIT SITE"}
            showProfileBtn={false}
            showWebsiteBtn={true}
            showBadge={false}
            showWebsiteBtnBorder={false}
            cardLayoutClasses="flex flex-col items-start justify-between"
            cardBgColor="bg-[#1A1A1A]"
            cardPadding="p-6 sm:p-5"
            cardGap="gap-2"
            cardMinHeight="min-h-[250px]"
            logoContainerSize="w-[90px] h-[45px] md:w-[140px] md:h-[70px]"
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
            bgIconTextSize="text-[9px] md:text-[13px]"
            bgIconPosition={`top-6 ${isRtl ? "left-6" : "right-6"}`}
          />
        ))}
      </div>
    </section>
  );
}
