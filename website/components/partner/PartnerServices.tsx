"use client";

import React from "react";
import * as Icons from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Icons;
}

interface PartnerServicesProps {
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    id: "1",
    title: "Next-Gen Connectivity",
    description:
      "Deploying 5G ready infrastructure across the historic and modern districts of Damascus.",
    iconName: "Radio",
  },
  {
    id: "2",
    title: "Enterprise Cloud",
    description:
      "Secure data hosting solutions tailored for the growing startup ecosystem in the region.",
    iconName: "Cloud",
  },
  {
    id: "3",
    title: "Community Hubs",
    description:
      "Public Wi-Fi zones and digital literacy centers in key cultural landmarks.",
    iconName: "Network",
  },
  {
    id: "4",
    title: "Cyber Security",
    description:
      "Advanced threat protection for domestic and international communication channels.",
    iconName: "Shield",
  },
];

export default function PartnerServices({
  services = defaultServices,
}: PartnerServicesProps) {
  return (
    <div className="w-full pt-28">
      <h2 className="text-[30px] md:text-[35px] font-semibold text-white mb-8 flex items-center gap-4 whitespace-nowrap">
        Services Provided
        <span className="hidden 2xl:block h-[1px] bg-[#EB0028] flex-grow opacity-80" />
      </h2>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 w-full">
        {services.map((service) => {
          // التعديل الجوهري لحل الأيرور: قمنا بعمل كاستينغ للتايب كـ ComponentType ليقبل الـ JSX تشغيله فورا
          const IconComponent = (Icons[service.iconName] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;

          return (
            <div
              key={service.id}
              className="p-8 bg-[#181818] border border-white/5 flex flex-col items-start transition-all duration-300 hover:border-white/10 w-full"
            >
              <div className="text-[#EB0028] mb-5">
                <IconComponent className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                {service.title}
              </h3>

              <p className="text-[#a8a8a8] text-[16px] md:text-[17px] leading-relaxed font-light">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}