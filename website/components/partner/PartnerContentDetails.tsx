"use client";

import PartnerContactCard from "./PartnerContactCard";
import PartnerFollowCard from "./PartnerFollowCard";
import PartnerServices from "./PartnerServices";
import { PartnerViewData } from "@/lib/api/partners";

interface Props {
  locale: "en" | "ar";
  partner: PartnerViewData;
}

export default function PartnerContentDetails({ locale, partner }: Props) {
  const isRtl = locale === "ar";

  return (
    <div
      className="w-full pb-20 px-4 sm:px-8 xl:px-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex flex-col 2xl:grid 2xl:grid-cols-[1.3fr_0.7fr] gap-16">
        
        <div className="flex flex-col gap-10 w-full max-w-[450px] mx-auto 2xl:mx-0 order-1 2xl:order-2">
          <PartnerContactCard contact={partner.contact_info} locale={locale} />

          <PartnerFollowCard
            websiteUrl={partner.social_links?.[0] ?? ""}
            locale={locale}
          />
        </div>

        <div className="flex flex-col w-full order-2 2xl:order-1">
          <h2 className="text-[30px] sm:text-[35px] font-semibold text-white mb-6 mt-8 2xl:mt-0">
            {isRtl ? "الابتكار والتأثير" : "Innovation & Impact"}
          </h2>

          <div className="text-[#a8a8a8] text-[18px] sm:text-[20px] leading-relaxed space-y-6">
            {partner.long_description}
          </div>

          <div className="mt-12">
            <PartnerServices services={partner.services} locale={locale} />
          </div>
        </div>

      </div>
    </div>
  );
}