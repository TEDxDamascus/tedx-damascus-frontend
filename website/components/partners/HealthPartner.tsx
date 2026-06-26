"use client";
import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";
import { PlusSquare, Eye, BriefcaseMedical, Microscope } from "lucide-react";
interface HealthPartnerProps {
  locale: string;
}

export default function HealthPartner({ locale }: HealthPartnerProps) {
  const isRtl = locale === "ar";

  const healthPartners = [
    {
      name: "Damascus Pharma",
      icon: BriefcaseMedical,
    },
    {
      name: "HealCenter",
      icon: PlusSquare,
    },
    {
      name: "Optic Levant",
      icon: Eye,
    },
    {
      name: "Vitality Labs",
      icon: Microscope,
    },
  ];

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شركاء الرعاية الصحية" : "HEALTH PARTNERS"}
        titleColor="text-[#EB0028]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 w-full">
        {healthPartners.map((partner, index) => {
          const IconComponent = partner.icon;

          return (
            <div
              key={index}
              className="w-full h-[100px] sm:h-[130px] bg-[#1A1A1A] border border-neutral-900 rounded-sm flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-[#222222] hover:border-neutral-800 select-none px-4"
            >
              <IconComponent className="w-7 h-7 text-[#EB0028]  " />

              <span className="font-helvetica font-bold text-[11px] sm:text-[14px] uppercase tracking-widest text-neutral-400 text-center leading-none">
                {partner.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
