"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

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
  iconSize?: string;
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

  logoLayoutClasses = "",
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

  iconSize = "w-16 h-16",
  iconOpacity = "opacity-40",
  bgIconTextSize = "text-[11px]",
  bgIconPosition = "",
  websiteBtnText,
}: PartnerCardProps) {
  const isRtl = locale === "ar";

  const getWebsiteBtnStyles = () => {
    if (!showWebsiteBtnBorder) {
      return websiteBtnBg
        .replace(/border-neutral-\d+/g, "border-transparent")
        .replace(/hover:border-neutral-\d+/g, "")
        .replace(/border-white\/\d+/g, "border-transparent")
        .replace(/hover:border-white/g, "")
        .replace(/border/g, "border-transparent");
    }
    return websiteBtnBg;
  };

  const isBgImageUrl = typeof bgIconUrl === "string" && (
    bgIconUrl.startsWith("/") || 
    bgIconUrl.startsWith("http") || 
    /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(bgIconUrl)
  );

  const defaultPosition = bgIconPosition || `top-6 ${isRtl ? "left-6" : "right-6"}`;

  const defaultBtnText = websiteBtnText || (isRtl ? "زيارة الموقع" : "Visit Website");

  return (
    <div
      className={`relative ${cardWidth} ${cardMinHeight} ${cardBgColor} ${cardPadding} ${cardGap} border border-neutral-900 rounded-sm transition-all duration-300 ${cardLayoutClasses}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background Icon / Text */}
      {bgIconUrl && (
        <div className={`absolute pointer-events-none z-0 ${iconOpacity} ${defaultPosition}`}>
          {isBgImageUrl ? (
            <div className={`${iconSize} relative`}>
              <Image src={bgIconUrl} alt="" fill className="w-full h-full object-contain" />
            </div>
          ) : (
            <span className={`font-helvetica font-bold uppercase tracking-widest text-neutral-600 whitespace-nowrap block ${bgIconTextSize}`}>
              {bgIconUrl}
            </span>
          )}
        </div>
      )}

      {/* Logo Container */}
      <div className={`relative flex items-center justify-center flex-shrink-0 overflow-hidden rounded-sm z-10 ${logoContainerBg} ${logoContainerSize} ${logoLayoutClasses}`}>
        <Image
          src={logoUrl}
          alt={`${name} Logo`}
          width={500}
          height={500}
          unoptimized
          className={`shadow-md max-w-full max-h-full ${logoImageFit}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/300x300/222/fff?text=Logo";
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className={`flex-grow h-full justify-center z-10 ${contentLayoutClasses}`}>
        {showBadge && tierBadge && (
          <div className="mb-4">
            <span className="bg-[#EB0028] text-white font-sans text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">
              {tierBadge}
            </span>
          </div>
        )}

        <h3 className={`${titleColor} ${titleSize} font-helvetica font-medium tracking-tight mb-3 leading-tight`}>
          {name}
        </h3>

        <p className={`font-sans mb-5 opacity-90 w-full leading-relaxed ${descriptionSize} ${descriptionColor}`}>
          {description}
        </p>

        <div className="flex flex-wrap gap-6 mt-2 justify-start">
          {showProfileBtn && (
            <a
              href={profileUrl}
              className={`inline-flex items-center gap-2 font-helvetica font-bold uppercase tracking-wider transition-colors ${btnTextSize} ${btnPadding} ${profileBtnBg}`}
            >
              {isRtl ? "عرض الملف" : "View Profile"}
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </a>
          )}

          {showWebsiteBtn && (
            <a
              href={websiteUrl}
              className={`inline-flex items-center gap-1.5 font-helvetica font-bold uppercase tracking-wider transition-colors ${btnTextSize} ${btnPadding} ${getWebsiteBtnStyles()}`}
            >
              {defaultBtnText}
              {isRtl ? <span className="text-xs"></span> : <span className="text-xs"></span>}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}