"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface OrganizersHeroProps {
  locale: string;
}

export default function OrganizersHero({ locale }: OrganizersHeroProps) {
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#101010]/80" />{" "}
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
              منظمونا{" "}
              <span className="text-[#EB0028] font-normal">الرسميون</span>
            </>
          ) : (
            <>
              Our{" "}
              <span className="text-[#EB0028] font-normal">Organizers </span>
            </>
          )}
        </motion.h1>
      </div>
    </section>
  );
}
