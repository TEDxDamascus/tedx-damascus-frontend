"use client";
import Image from "next/image";
interface BecomePartnerProps {
  locale: string;
}
export default function BecomePartner({ locale }: BecomePartnerProps) {
  const isRtl = locale === "ar";

  return (
    <section className="w-[85%] md:w-[50%] mx-auto mt-40 mb-20 animate-fade-in">
      <div className="relative w-full bg-[#EB0028] overflow-hidden rounded-sm px-6 py-12 sm:py-16 md:px-12 flex flex-col items-center text-center justify-center h-[500px]">
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          aria-hidden
        >
          <Image
            src="/images/partners/Image.svg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col items-center gap-5">
          <h2
            id="become-partner-title"
            className="text-2xl sm:text-[40px] md:text-[46px] font-helvetica font-bold uppercase tracking-wider text-black leading-none mb-4 sm:mb-6"
          >
            {isRtl ? "كن شريكاً معنا" : "BECOME A PARTNER"}
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base font-normal text-black leading-relaxed opacity-90 max-w-xl mb-8">
            {isRtl
              ? "انضم إلى مجتمع المبتكرين والقادة الذين يدعمون TEDxDamascus. لنعرض معاً تميز مدينتنا للعالم أجمع."
              : "Join the community of innovators and leaders supporting TEDxDamascus. Let's showcase the brilliance of our city to the world."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto justify-center">
            <a
              href="#"
              className="bg-[#101010] text-white hover:bg-[#1A1A1A] text-[11px] sm:text-xs font-helvetica font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-colors text-center shadow-md min-w-[180px]"
            >
              {isRtl ? "ملف الشراكة" : "PARTNER PROSPECTUS"}
            </a>

            <a
              href="#"
              className="bg-transparent text-black border-black hover:bg-black/5 text-[11px] sm:text-xs font-helvetica font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-colors border-2 text-center min-w-[180px]"
            >
              {isRtl ? "تواصل معنا" : "GET IN TOUCH"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
