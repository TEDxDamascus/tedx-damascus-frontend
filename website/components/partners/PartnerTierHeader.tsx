"use client";

import React from "react";

interface PartnerTierHeaderProps {
  title: string;
  titleColor?: string; 
}

export default function PartnerTierHeader({ 
  title, 
  titleColor = "text-[#EB0028]" 
}: PartnerTierHeaderProps) {
  return (
    <div className="w-full flex items-center gap-4 my-8" dir="ltr">
      <span className={`${titleColor} font-helvetica text-xs sm:text-lg font-bold uppercase tracking-widest whitespace-nowrap`}>
        {title}
      </span>

      <div className="h-[1px] bg-neutral-800 w-full opacity-60" />
    </div>
  );
}