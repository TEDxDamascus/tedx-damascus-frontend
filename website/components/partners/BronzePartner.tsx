"use client";

import React from "react";
import PartnerTierHeader from "./PartnerTierHeader";

interface BronzePartnerProps {
  locale: string;
}

export default function BronzePartner({ locale }: BronzePartnerProps) {
  const isRtl = locale === "ar";

  const bronzePartners = [
    { name: "Ecostream" },
    { name: "Nomad Coffee" },
    { name: "DataSyria" },
    { name: "Flow Digital" },
    { name: "Zenith Media" },
    { name: "Levant Artisans" },
  ];

  return (
    <section className="w-[90%] max-w-[90vw] mx-auto mb-16 animate-fade-in">
      <PartnerTierHeader
        title={isRtl ? "شريك برونزي" : "BRONZE TIER"}
        titleColor="text-neutral-600" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 w-full">
        {bronzePartners.map((partner, index) => (
          <div
            key={index}
            className="w-full h-[70px] sm:h-[80px] bg-[#1A1A1A] border border-neutral-900 rounded-sm flex items-center justify-center transition-all duration-300 hover:bg-[#222222] hover:border-neutral-800 select-none px-4"
          >
            <span className="font-helvetica font-bold text-[13px] sm:text-[14px] uppercase tracking-widest text-neutral-400 text-center leading-none">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}