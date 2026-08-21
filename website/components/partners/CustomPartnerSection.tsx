"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import PartnerCard from "./PartnerCard";
import { PartnerViewData, CardSizeEnum } from "@/lib/api/partners";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/api/client";

interface CustomPartnerSectionProps {
  locale: "en" | "ar";
  title: string;
  titleColor?: string;
  partners: PartnerViewData[];
}

export default function CustomPartnerSection({
  locale,
  title,
  titleColor = "text-neutral-400",
  partners = [],
}: CustomPartnerSectionProps) {
  const isRtl = locale === "ar";
  const router = useRouter();

  if (!partners || partners.length === 0) return null;

  // معرفة الحجم المحدد للشركاء في هذا السكشن (نأخذ حجم أول عنصر كمرجع أو افتراضي)
const rawSize = partners[0]?.custom_card_size ?? CardSizeEnum.MEDIUM;  const size = String(rawSize).toLowerCase();

  const safeSlug = (slug: any) =>
    typeof slug === "string" ? slug : slug?.[locale] || slug?.en || slug?.ar || "";

  const safeName = (name: any) =>
    typeof name === "string" ? name : name?.[locale] || name?.en || name?.ar || "";

  const handleNavigate = (slug?: string) => {
    if (!slug) return;
    // trailingSlash: true in next.config.ts means the static export writes
    // each partner page to partner/<slug>/index.html — router.push() (unlike
    // next/link) doesn't normalize that for us.
    router.push(`/${locale}/partner/${slug}/`);
  };

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      {/* Header السكشن المخصص */}
      <PartnerTierHeader
        title={title}
        titleColor={titleColor}
        locale={locale}
      />

      {/* 1. LARGE CARD LAYOUT */}
      {size === "large" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-6 w-full">
          {partners.map((partner) => (
            <PartnerCard
              key={partner._id}
              locale={locale}
              name={safeName(partner.name)}
              description={partner.short_description}
              logoUrl={partner.image ? getImageUrl(partner.image) : ""}
              bgIconUrl={title}
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
      )}

      {/* 2. MEDIUM CARD LAYOUT */}
      {(size === "med" || size === "medium") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-6 w-full">
          {partners.map((partner) => (
            <PartnerCard
              key={partner._id}
              locale={locale}
              name={safeName(partner.name)}
              description={partner.short_description ?? ""}
              logoUrl={
                partner.image
                  ? getImageUrl(partner.image)
                  : "https://placehold.co/300x300/222/fff?text=Logo"
              }
              websiteUrl={partner.social_links?.[0] ?? "#"}
              profileUrl={
                safeSlug(partner.slug)
                  ? `/${locale}/partner/${safeSlug(partner.slug)}`
                  : "#"
              }
              bgIconUrl={title}
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
      )}

      {/* 3. SMALL CARD LAYOUT */}
      {size === "small" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 w-full">
          {partners.map((partner, index) => {
            const name = safeName(partner.name);
            const slug = safeSlug(partner.slug);

            return (
              <div
                key={partner._id || index}
                onClick={() => handleNavigate(slug)}
                className={`w-full h-[70px] sm:h-[80px] bg-[#1A1A1A] border border-neutral-900 rounded-sm flex items-center justify-center transition-all duration-300 hover:bg-[#222222] hover:border-neutral-800 select-none px-4 ${
                  slug ? "cursor-pointer" : ""
                }`}
              >
                <span
                  className={`font-helvetica font-bold text-[13px] sm:text-[14px] text-neutral-400 text-center leading-none ${
                    isRtl ? "" : "uppercase tracking-widest"
                  }`}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}