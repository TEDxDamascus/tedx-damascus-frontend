"use client";

import { Layers } from "lucide-react";
import { PartnerViewData } from "@/lib/api/partners";

interface Props {
  services: PartnerViewData["services"];
  locale: "en" | "ar";
}

export default function PartnerServices({ services, locale }: Props) {
  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      <h2 className="text-white text-[30px] mb-8">
        {isRtl ? "الخدمات" : "Services"}
      </h2>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">

        {services?.map((service, i) => (
          <div key={i} className="p-6 bg-[#181818]">

            <Layers className="text-red-500 mb-4" />

            <h3 className="text-white mb-2">
              {service.title}
            </h3>

            <p className="text-gray-400">
              {service.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}