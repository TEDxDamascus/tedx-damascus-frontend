"use client";

import Image from "next/image";
import { PartnerViewData } from "@/lib/api/partners";

interface PartnerInfoProps {
  locale: "en" | "ar";
  partner: PartnerViewData;
}

export default function PartnerInfo({ locale, partner }: PartnerInfoProps) {
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full pt-20 pb-12 px-4 sm:px-8 xl:px-12"
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] items-center gap-16">
        <div className="flex justify-center xl:justify-end order-1 xl:order-2">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] xl:w-[450px] xl:h-[450px] bg-[#1A1A1A]">
            <Image
              src={partner.image}
              alt={partner.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center xl:items-start text-center xl:text-left order-2 xl:order-1">
          <span className="bg-[#EB0028] text-white px-4 py-1 text-xs uppercase tracking-wider">
            {partner.partner_ship_type}
          </span>

          <h1 className="mt-6 text-white text-[36px] sm:text-[48px] xl:text-[60px] font-light whitespace-pre-line leading-tight">
            {partner.name}
          </h1>

          <p className="mt-6 text-[#a8a8a8] text-[18px] sm:text-[20px] max-w-[750px]">
            {partner.short_description || partner.long_description}
          </p>
        </div>
      </div>
    </section>
  );
}
