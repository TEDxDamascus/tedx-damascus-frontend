"use client";

import { useState } from "react";
import { Globe, Share2 } from "lucide-react";

interface PartnerFollowCardProps {
  websiteUrl?: string;
  locale?: "en" | "ar";
}

export default function PartnerFollowCard({
  websiteUrl,
  locale = "en",
}: PartnerFollowCardProps) {
  const [copied, setCopied] = useState(false);

  const isRtl = locale === "ar";

  const content = {
    en: {
      copied: "Copied!",
      globeLabel: "Visit Website",
      shareLabel: "Share Link",
    },
    ar: {
      copied: "تم النسخ!",
      globeLabel: "زيارة الموقع",
      shareLabel: "مشاركة الرابط",
    },
  };

  const t = content[locale];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative p-6 sm:p-8 bg-[#1A1A1A] border border-[#353535] w-full xl:w-full max-w-[450px] select-none"
    >
      <h3
        className={`text-[18px] sm:text-[22px] font-bold text-[#f1f1f1] mb-6 ${
          isRtl
            ? "font-sans tracking-normal"
            : "tracking-widest uppercase"
        }`}
      >
       {isRtl ? " تابع الرحلة " : "Follow The Journey"}
      </h3>

      <div className="flex items-center gap-4">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.globeLabel}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#101010] border border-white/10 flex items-center justify-center text-[#f1f1f1] hover:text-white transition-colors group"
          >
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />
          </a>
        ) : (
          <div
            title={t.globeLabel}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#101010] border border-white/10 flex items-center justify-center text-[#666] cursor-not-allowed"
          >
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}

        <button
          onClick={handleShare}
          title={t.shareLabel}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#101010] border border-white/10 flex items-center justify-center text-[#f1f1f1] hover:text-white transition-colors group relative"
        >
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105" />

          {copied && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#EB0028] text-[10px] px-2 py-0.5 rounded-xs whitespace-nowrap animate-fade-in font-sans">
              {t.copied}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}