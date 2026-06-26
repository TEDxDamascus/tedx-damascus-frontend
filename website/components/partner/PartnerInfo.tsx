"use client";

import Image from "next/image";

interface PartnerInfoProps {
  locale: string;
  slug: string;
}

export default function PartnerInfo({ locale }: PartnerInfoProps) {
  const isRtl = locale === "ar";

  const partnerData = {
    tier: "PLATINUM PARTNER",
    name: "Sham\nTelecommunications",
    description:
      "Pioneering the digital frontier of Syria through innovative network infrastructure and community-driven connectivity solutions.",
    logoSrc: "/images/partner-details/sham-logo.png",
  };

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full pt-20 md:pt-24 xl:pt-28 pb-12 md:pb-16 px-4 sm:px-8 xl:px-12"
    >
      <div className="w-full max-w-[1440px] mx-auto">
        {/* التعديل: إضافة items-center لجعل العناصر تتوسط عمودياً في الريسبونسف */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] items-center gap-16 xl:gap-x-32">
          
          {/* العمود الأول: المحتوى النصي */}
          {/* التعديل: إضافة flex flex-col items-center xl:items-start text-center xl:text-left لتوسيط النصوص */}
          <div className="order-1 w-full flex flex-col items-center xl:items-start text-center xl:text-left">
            <span className="inline-flex bg-[#EB0028] text-white uppercase tracking-[2px] font-semibold text-[11px] sm:text-xs xl:text-sm px-4 xl:px-5 py-1.5">
              {partnerData.tier}
            </span>
            
            <h1 className="mt-8 whitespace-pre-line text-white text-[42px] leading-[48px] sm:text-[52px] sm:leading-[60px] md:text-[60px] md:leading-[68px] xl:text-[74px] xl:leading-[82px] font-light tracking-[-2px] xl:tracking-[-3px] max-w-full xl:max-w-[780px]">
              {partnerData.name}
            </h1>

            <p className="mt-8 max-w-full xl:max-w-[750px] mx-auto xl:mx-0 text-[20px] leading-8 md:text-[22px] md:leading-10 xl:text-[25px] xl:leading-[45px] text-[#a8a8a8] font-light">
              {partnerData.description}
            </p>
          </div>

          <div className="order-2 flex justify-center xl:justify-end w-full mb-8 xl:mb-0">
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[390px] md:h-[390px] xl:w-[450px] xl:h-[450px] bg-[#1A1A1A] shrink-0">
              <div className="absolute -top-2 -left-2 w-10 h-10 border-l-[3px] border-t-[3px] border-[#EB0028]" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 border-r-[3px] border-b-[3px] border-[#EB0028]" />

              <div className="absolute inset-8 sm:inset-10 xl:inset-14 bg-[#101010] flex items-center justify-center">
                <div className="relative w-[60%] h-[60%] xl:w-[70%] xl:h-[70%]">
                  <Image
                    src={partnerData.logoSrc}
                    alt={partnerData.name}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}