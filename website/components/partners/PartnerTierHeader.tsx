"use client";
interface PartnerTierHeaderProps {
  title: string;
  titleColor?: string;
  className?: string; 
  locale?: "en" | "ar"; 
}
export default function PartnerTierHeader({
  title,
  titleColor = "text-[#EB0028]",
  className = "",
  locale = "en", 
}: PartnerTierHeaderProps) {
  const isRtl = locale === "ar";

  return (
    <div
      className={`w-full flex items-center gap-4 pt-16 pb-8 ${className}`}
      dir={isRtl ? "rtl" : "ltr"} 
    >
      <span
        className={`${titleColor} font-helvetica text-xs sm:text-lg font-bold uppercase tracking-widest whitespace-nowrap`}
      >
        {title}
      </span>

      <div className="h-[1px] bg-neutral-800 w-full opacity-60" />
    </div>
  );
}