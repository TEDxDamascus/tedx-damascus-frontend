"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface PartnersHeroProps {
  locale: string;
}

export default function PartnersHero({ locale }: PartnersHeroProps) {
  const isRtl = locale === "ar";

  return (
    <section
      className="relative bg-page-bg overflow-hidden flex flex-col items-center justify-center text-center pt-[140px] pb-[80px] sm:pt-[180px] sm:pb-[120px]"
      aria-label="Our Partners Hero"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden
      >
        <Image
          src="/images/about/pattern.svg" 
          alt=""
          fill
          className="object-cover object-center"
          draggable={false}
          priority 
        />
      </div>

      <div className="relative z-[2] max-w-4xl px-6 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[40px] sm:text-[56px] md:text-[64px] font-helvetica font-light tracking-tight text-white leading-tight mb-6"
        >
          {isRtl ? (
            <>
              شركاؤنا{" "}
              <span className="text-[#EB0028] font-normal">الرسميين</span>
            </>
          ) : (
            <>
              Our <span className="text-[#EB0028] font-normal">Partners</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#EEEEEE] font-sans text-[18px] sm:text-base md:text-lg leading-relaxed max-w-2xl opacity-90"
        >
          {isRtl
            ? "حدث TEDxDamascus أصبح ممكناً بفضل التعاون مع منظمات تطلعية تؤمن بقوة الأفكار في تغيير العالم."
            : "TEDx Damascus is made possible through the collaboration of forward-thinking organizations that believe in the power of ideas to change the world."}
        </motion.p>
      </div>
    </section>
  );
}
