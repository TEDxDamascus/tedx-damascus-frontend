"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { PartnerViewData } from "@/lib/api/partners";

interface Props {
  contact: PartnerViewData["contact_info"];
  locale: "en" | "ar";
}

export default function PartnerContactCard({ contact, locale }: Props) {
  const isRtl = locale === "ar";

  const hasContactInfo =
    contact &&
    (contact.address?.trim() ||
      contact.email?.trim() ||
      contact.phone?.trim());

  if (!hasContactInfo) {
    return null;
  }

  return (
    <div
      className="p-6 bg-[#181818]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <h3 className="text-white mb-6">
        {isRtl ? "معلومات التواصل" : "Contact Information"}
      </h3>

      {/* Address */}
      {contact.address?.trim() && (
        <div className="flex gap-4 mb-6">
          <MapPin className="text-red-500 shrink-0" />
          <p className="text-gray-400">
            {contact.address}
          </p>
        </div>
      )}

      {/* Email */}
      {contact.email?.trim() && (
        <div className="flex gap-4 mb-6">
          <Mail className="text-red-500 shrink-0" />
          <p className="text-gray-400">
            {contact.email}
          </p>
        </div>
      )}

      {/* Phone */}
      {contact.phone?.trim() && (
        <div className="flex gap-4">
          <Phone className="text-red-500 shrink-0" />
          <p className="text-gray-400">
            {contact.phone}
          </p>
        </div>
      )}
    </div>
  );
}