"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// `next.config.ts` has `trailingSlash: true`, so the static export writes
// each partner page to `partner/<slug>/index.html`. `next/link` normalizes
// its own `href` for that automatically, but a manually-built path used with
// a plain `<a>` or `router.push()` does not — it needs the trailing slash
// added here or the built path never resolves once deployed.
function withTrailingSlash(path: string): string {
  if (!path || path === "#" || path.endsWith("/")) return path;
  return `${path}/`;
}

interface PartnerCardProps {
  locale: string;
  name: string;
  description: string;
  logoUrl: string;
  tierBadge?: string;
  websiteUrl?: string;
  profileUrl?: string;
  bgIconUrl?: string;

  showProfileBtn?: boolean;
  showWebsiteBtn?: boolean;
  showBadge?: boolean;
  showWebsiteBtnBorder?: boolean;

  cardLayoutClasses?: string;
  cardWidth?: string;
  cardMinHeight?: string;
  cardPadding?: string;
  cardBgColor?: string;
  cardGap?: string;

  logoLayoutClasses?: string;
  logoContainerSize?: string;
  logoContainerBg?: string;
  logoImageFit?: string;

  contentLayoutClasses?: string;
  titleSize?: string;
  titleColor?: string;
  descriptionSize?: string;
  descriptionColor?: string;

  profileBtnBg?: string;
  websiteBtnBg?: string;
  btnTextSize?: string;
  btnPadding?: string;

  iconOpacity?: string;
  bgIconTextSize?: string;
  bgIconPosition?: string;

  websiteBtnText?: string;
}

export default function PartnerCard({
  locale,
  name,
  description,
  logoUrl,
  tierBadge,
  websiteUrl = "#",
  profileUrl = "#",
  bgIconUrl,

  showProfileBtn = true,
  showWebsiteBtn = true,
  showBadge = false,
  showWebsiteBtnBorder = true,

  cardLayoutClasses = "flex flex-col items-start justify-between",
  cardWidth = "w-full",
  cardMinHeight = "min-h-[500px]",
  cardPadding = "p-8 sm:p-12",
  cardBgColor = "bg-[#1A1A1A]",
  cardGap = "gap-8",

  logoContainerSize = "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]",
  logoContainerBg = "bg-[#353535]",
  logoImageFit = "object-contain",

  contentLayoutClasses = "w-full flex flex-col text-start items-start",
  titleSize = "text-2xl sm:text-5xl",
  titleColor = "text-white",
  descriptionSize = "text-2xl sm:text-3xl",
  descriptionColor = "text-[#E9BCB8]/60",

  profileBtnBg = "bg-transparent text-[#EB0028] border border-transparent hover:bg-white/5",
  websiteBtnBg = "bg-transparent text-white border border-neutral-700 hover:border-neutral-500",
  btnTextSize = "text-sm sm:text-base",
  btnPadding = "px-6 py-3.5",

  iconOpacity = "opacity-40",
  bgIconTextSize = "text-[11px]",
  bgIconPosition = "",
  websiteBtnText,
}: PartnerCardProps) {
  const isRtl = locale === "ar";
  const router = useRouter();
  const normalizedProfileUrl = withTrailingSlash(profileUrl);

const isWholeCardClickable =
  !showProfileBtn && profileUrl !== "#";

  const defaultBtnText =
    websiteBtnText || (isRtl ? "زيارة الموقع" : "Visit Website");

  const handleCardClick = () => {
    if (isWholeCardClickable) {
      router.push(normalizedProfileUrl);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative ${cardWidth} ${cardMinHeight} ${cardBgColor} ${cardPadding} ${cardGap} border border-neutral-900 rounded-sm transition-all duration-300 ${cardLayoutClasses} ${
        isWholeCardClickable
          ? "cursor-pointer hover:border-neutral-700 hover:bg-[#1F1F1F]"
          : ""
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Icon */}
      {bgIconUrl && (
        <div
          className={`absolute pointer-events-none z-0 ${iconOpacity} ${bgIconPosition}`}
        >
          <span
            className={`font-helvetica font-bold uppercase tracking-widest text-neutral-600 whitespace-nowrap block ${bgIconTextSize}`}
          >
            {bgIconUrl}
          </span>
        </div>
      )}

      {/* Logo */}
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-sm z-10 ${logoContainerBg} ${logoContainerSize}`}
      >
        <Image
          src={logoUrl}
          alt={name}
          width={500}
          height={500}
          className={`max-w-full max-h-full ${logoImageFit}`}
        />
      </div>

      {/* Content */}
      <div className={`flex-grow z-10 ${contentLayoutClasses}`}>
        {showBadge && tierBadge && (
          <div className="mb-4">
            <span className="bg-[#EB0028] text-white text-[11px] font-bold uppercase px-2.5 py-1">
              {tierBadge}
            </span>
          </div>
        )}

        <h3 className={`${titleColor} ${titleSize} font-helvetica mb-3`}>
          {name}
        </h3>

        <p className={`${descriptionSize} ${descriptionColor} mb-5`}>
          {description}
        </p>

        <div className="flex flex-wrap gap-6 mt-2">
          {showProfileBtn && (
            <Link
              href={normalizedProfileUrl}
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 font-helvetica font-bold uppercase ${btnTextSize} ${btnPadding} ${profileBtnBg}`}
            >
              {isRtl ? "عرض الملف" : "View Profile"}
              {isRtl ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </Link>
          )}

          {showWebsiteBtn && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 font-helvetica font-bold uppercase ${btnTextSize} ${btnPadding} ${websiteBtnBg}`}
            >
              {defaultBtnText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}