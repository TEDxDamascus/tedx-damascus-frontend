"use client";

import PartnerContactCard from "./PartnerContactCard";
import PartnerFollowCard from "./PartnerFollowCard";
import PartnerServices from "./PartnerServices";

interface PartnerContentDetailsProps {
  locale: string;
}

export default function PartnerContentDetails({
  locale,
}: PartnerContentDetailsProps) {
  const isRtl = locale === "ar";

  return (
    <div
      className="w-full pb-20 px-4 sm:px-8 xl:px-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 2xl:grid-cols-[1.3fr_0.7fr] gap-16 2xl:gap-x-32 items-start">
        <div className="flex flex-col items-start w-full order-1">
          <div className="w-full">
            <h2 className="text-[30px] md:text-[35px] font-semibold text-white mb-6 flex items-center gap-4 whitespace-nowrap">
              Innovation & Impact
              <span className="hidden 2xl:block h-[1px] bg-[#EB0028] flex-grow opacity-80" />
            </h2>

            <div className="text-[#a8a8a8] text-base md:text-[25px] leading-relaxed font-light space-y-6 max-w-full">
              <p>
                Sham Telecommunications has been at the forefront of the
                technological renaissance in Damascus. By investing in
                fiber-optic expansions and supporting local tech incubators,
                they have transformed the way ideas circulate within the city.
              </p>
              <p>
                Our partnership with Sham Telecommunications extends beyond
                branding. They provide the high-speed backbone for our live
                streams, ensuring that the Ideas Worth Spreading from our stage
                reach a global audience without interruption. Their commitment
                to social responsibility is reflected in their extensive support
                for youth educational programs across Syria.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full mt-12 2xl:hidden justify-start">
            <div className="w-full sm:w-auto">
              <PartnerContactCard />
            </div>
            <div className="w-full sm:w-auto">
              <PartnerFollowCard />
            </div>
          </div>

          <PartnerServices />
        </div>

        <div className="hidden 2xl:flex order-2 flex-col items-end w-full 2xl:w-[450px] 2xl:min-w-[450px] shrink-0 lg:top-24 space-y-10">
          <PartnerContactCard />
          <PartnerFollowCard />
        </div>
      </div>
    </div>
  );
}
