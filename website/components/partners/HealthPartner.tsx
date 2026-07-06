"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import { useRouter } from "next/navigation";
import {
  PlusSquare,
  Eye,
  BriefcaseMedical,
  Microscope,
  HeartPulse,
  Stethoscope,
  Bone,
  Dna,
  Sparkles,
} from "lucide-react";
import { PartnerViewData } from "@/lib/api/partners";

interface HealthPartnerProps {
  locale: "en" | "ar";
  partners?: PartnerViewData[];
}

export default function HealthPartner({
  locale,
  partners,
}: HealthPartnerProps) {
  const isRtl = locale === "ar";
  const router = useRouter();

  const displayPartners = partners ?? [];

  const handleNavigate = (slug?: string) => {
    if (!slug) return;
    router.push(`/${locale}/partner/${slug}`);
  };

  const getHealthIcon = (name: string) => {
    const searchStr = (name || "").toLowerCase();

    if (
      searchStr.includes("optic") ||
      searchStr.includes("vision") ||
      searchStr.includes("eye") ||
      searchStr.includes("بصريات") ||
      searchStr.includes("عيون")
    ) {
      return Eye;
    }

    if (
      searchStr.includes("pharma") ||
      searchStr.includes("medicine") ||
      searchStr.includes("صيدل") ||
      searchStr.includes("دواء")
    ) {
      return BriefcaseMedical;
    }

    if (
      searchStr.includes("lab") ||
      searchStr.includes("test") ||
      searchStr.includes("مختبر") ||
      searchStr.includes("تحاليل")
    ) {
      return Microscope;
    }

    if (
      searchStr.includes("heart") ||
      searchStr.includes("cardio") ||
      searchStr.includes("قلب")
    ) {
      return HeartPulse;
    }

    if (
      searchStr.includes("physio") ||
      searchStr.includes("bone") ||
      searchStr.includes("عظام") ||
      searchStr.includes("طبيعي")
    ) {
      return Bone;
    }

    if (
      searchStr.includes("scan") ||
      searchStr.includes("dna") ||
      searchStr.includes("أشعة") ||
      searchStr.includes("رنين")
    ) {
      return Dna;
    }

    if (
      searchStr.includes("derma") ||
      searchStr.includes("skin") ||
      searchStr.includes("تجميل") ||
      searchStr.includes("جلدية")
    ) {
      return Sparkles;
    }

    if (
      searchStr.includes("center") ||
      searchStr.includes("hospital") ||
      searchStr.includes("clinic") ||
      searchStr.includes("مركز") ||
      searchStr.includes("مستشفى") ||
      searchStr.includes("عيادة")
    ) {
      return PlusSquare;
    }

    return Stethoscope;
  };

  if (displayPartners.length === 0) return null;

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شركاء الرعاية الصحية" : "HEALTH PARTNERS"}
        titleColor="text-[#EB0028]"
        locale={locale}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 w-full">
        {displayPartners.map((partner) => {
          const IconComponent = getHealthIcon(partner.name);

          return (
            <div
              key={partner._id}
              onClick={() => handleNavigate(partner.slug)}
              className={`w-full h-[95px] sm:h-[130px] bg-[#1A1A1A] border border-neutral-900 rounded-sm flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:bg-[#222222] hover:border-neutral-800 hover:scale-[1.02] select-none px-3 sm:px-4 group ${
                partner.slug ? "cursor-pointer" : ""
              }`}
            >
              <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-[#EB0028] transition-transform duration-300 group-hover:scale-110" />

              <span className="font-helvetica font-bold text-[10px] sm:text-[13px] uppercase tracking-widest text-neutral-400 text-center leading-tight max-w-full block line-clamp-2 px-1">
                {partner.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
