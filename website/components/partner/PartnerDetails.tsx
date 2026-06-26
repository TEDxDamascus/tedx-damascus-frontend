"use client";

import { Footer, Navbar } from "@/components/layout";
import PartnerHeroPattern from "@/components/partner/PartnerHeroPattern";
import PartnerInfo from "@/components/partner/PartnerInfo";
import PartnerContentDetails from "./PartnerContentDetails";

interface PartnerDetailsProps {
  locale: string;
  slug: string;
}

export default function PartnerDetails({ locale, slug }: PartnerDetailsProps) {
  return (
    <main>
      <div className="relative z-50 w-full">
        <Navbar locale={locale} />
      </div>

      <div className="absolute top-0 left-0 right-0 z-0">
        <PartnerHeroPattern />
      </div>

      <div className="  w-[75%] mx-auto pt-[120px] flex flex-col">
        <PartnerInfo locale={locale} slug={slug} />

        <div>
          <PartnerContentDetails locale={locale} />
        </div>
      </div>

      <div>
        <Footer locale={locale} />
      </div>
    </main>
  );
}
