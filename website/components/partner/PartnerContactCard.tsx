"use client";

import { MapPin, Mail, Phone } from "lucide-react";

export default function PartnerContactCard() {
  const contactData = {
    address: "Sham Towers, Al-Mezzeh Highway\nDamascus, Syria",
    email: "partnership@sham-telecom.sy",
    phone: "+963 11 555 0123",
  };

  return (
    <div className="relative p-6 sm:p-8 bg-[#181818] border border-white/5 w-full xl:w-full max-w-[450px] select-none">
      <div className="absolute top-0 start-0 w-5 h-5 bg-[#EB0028]" />

      <h3 className="text-[20px] sm:text-[22px] font-bold tracking-widest text-[#f1f1f1] uppercase mb-8">
        Contact Information
      </h3>

      <div className="space-y-6">
        <div className="flex items-start space-x-4 sm:space-x-6 rtl:space-x-reverse">
          <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#EB0028] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[#f1f1f1] mb-1">
              Headquarters
            </h4>
            <p className="text-base sm:text-lg text-[#a8a8a8] whitespace-pre-line leading-relaxed">
              {contactData.address}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 sm:space-x-6 rtl:space-x-reverse">
          <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-[#EB0028] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[#f1f1f1] mb-1">
              Email
            </h4>
            <p className="text-base sm:text-lg text-[#a8a8a8] break-all">
              {contactData.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 sm:space-x-6 rtl:space-x-reverse">
          <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-[#EB0028] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[#f1f1f1] mb-1">
              Phone
            </h4>
            <p className="text-base sm:text-lg text-[#a8a8a8]">
              {contactData.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
