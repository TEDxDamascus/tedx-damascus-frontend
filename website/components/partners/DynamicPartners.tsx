"use client";

import PartnerTierHeader from "./PartnerTierHeader";
import { useRouter } from "next/navigation";
import { PartnerViewData } from "@/lib/api/partners";
import { partnerTierRegistry } from "./PartnerTierRegistry";

interface DynamicPartnersProps {
  locale: "en" | "ar";
  partnersData: PartnerViewData[];
}

export default function DynamicPartners({
  locale,
  partnersData,
}: DynamicPartnersProps) {
  const isRtl = locale === "ar";
  const router = useRouter();

const staticTiers = Object.keys(partnerTierRegistry);

  const dynamicPartners = (partnersData ?? []).filter(
    (p) =>
      p.partnership_type &&
      !staticTiers.includes(p.partnership_type.toLowerCase())
  );

  if (dynamicPartners.length === 0) return null;

  const grouped = dynamicPartners.reduce((acc, partner) => {
    const tier = partner.partnership_type.toLowerCase();
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(partner);
    return acc;
  }, {} as Record<string, PartnerViewData[]>);

  const handleNavigate = (slug?: string) => {
    if (!slug) return;
    router.push(`/${locale}/partner/${slug}`);
  };

  return (
    <>
      {Object.entries(grouped).map(([tierName, partnersList]) => {
        const TierComponent = partnerTierRegistry[tierName];

        if (TierComponent) {
          return (
            <TierComponent
              key={tierName}
              locale={locale}
              partners={partnersList}
            />
          );
        }

        return (
          <section
            key={tierName}
            className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in"
          >
            <PartnerTierHeader
              title={
                isRtl
                  ? `شركاء ${tierName.toUpperCase()}`
                  : `${tierName.toUpperCase()} PARTNERS`
              }
              titleColor="text-[#EB0028]"
              locale={locale}
            />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 w-full">
              {partnersList.map((partner) => (
                <div
                  key={partner._id}
                  onClick={() => handleNavigate(partner.slug)}
                  className={`w-full h-[80px] sm:h-[130px] bg-[#1A1A1A] border border-neutral-900 rounded-sm flex items-center justify-center px-3 sm:px-4 transition-all hover:bg-[#222] ${
                    partner.slug ? "cursor-pointer" : ""
                  }`}
                >
                  <span className="text-neutral-400 text-center text-[10px] sm:text-[13px] uppercase font-bold line-clamp-2">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}