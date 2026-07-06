"use client";
import PartnerTierHeader from "./PartnerTierHeader";
import { PartnerViewData } from "@/lib/api/partners";
import { useRouter } from "next/navigation";

interface BronzePartnerProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function BronzePartner({
  locale,
  partners,
}: BronzePartnerProps) {
  const isRtl = locale === "ar";
  const router = useRouter();

  const displayPartners = Array.isArray(partners) ? partners : [];

  if (displayPartners.length === 0) {
    return null;
  }

  const handleNavigate = (slug?: string) => {
    if (!slug) return;
    router.push(`/${locale}/partner/${slug}`);
  };

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك برونزي" : "BRONZE TIER"}
        titleColor="text-neutral-600"
        locale={locale}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 w-full">
        {displayPartners.map((partner: any, index) => {
          const name = partner?.name?.en || partner?.name?.ar || partner?.name;

          const slug =
            typeof partner?.slug === "string"
              ? partner.slug
              : partner?.slug?.en || partner?.slug?.ar;

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
    </section>
  );
}