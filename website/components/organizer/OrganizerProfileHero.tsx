"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OrganizerViewData } from "@/lib/api/organizers";
<<<<<<< Updated upstream
import { getImageUrl } from "@/lib/api/client";
=======
import { PressKitShareButton } from "@/components/shared";
>>>>>>> Stashed changes

interface OrganizerProfileHeroProps {
  organizer: OrganizerViewData;
  locale?: string;
}

function normalizeExternalUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default function OrganizerProfileHero({
  organizer,
  locale = "en",
}: OrganizerProfileHeroProps) {
  const isRtl = locale === "ar";
  const linkedinUrl = organizer.social_links?.find((link) =>
    link.toLowerCase().includes("linkedin"),
  );
  const normalizedLinkedin = linkedinUrl
    ? normalizeExternalUrl(linkedinUrl)
    : undefined;

  const actionClass =
    "inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-widest text-[#A8A8A8] hover:text-white transition-colors";

  return (
    <section className="relative w-full text-white flex items-center justify-center pt-32 sm:pt-40 lg:pt-52 pb-12 lg:pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 xl:gap-24">
        {/* 🌟 حاوية الصورة والأشكال الهندسية */}
        <div className="relative w-[260px] h-[330px] sm:w-[300px] sm:h-[380px] md:w-[340px] md:h-[430px] lg:w-[380px] lg:h-[480px] shrink-0">
          {/* الأشكال الهندسية العلوية */}
          <div className="absolute -top-5 -right-6 sm:-top-6 sm:-right-8 z-20 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
            <Image
              src="/images/organizers/fillTriangle.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute -top-3 -right-8 sm:-top-4 sm:-right-10 z-20 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
            <Image
              src="/images/organizers/Triangle.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* الأشكال الهندسية السفلية */}
          <div className="absolute -bottom-5 -left-6 sm:-bottom-6 sm:-left-8 z-20 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
            <Image
              src="/images/organizers/fillSquare.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute -bottom-7 -left-8 sm:-bottom-8 sm:-left-10 z-20 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none">
            <Image
              src="/images/organizers/Square.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* صورة المنظم */}
          <div className="relative w-full h-full z-20 bg-[#1A1A1A] overflow-hidden border border-neutral-800">
            {organizer.image ? (
              <Image
                src={getImageUrl(organizer.image)}
                alt={organizer.name}
                fill
                className="object-cover object-top grayscale"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* 🌟 التفاصيل والنصوص */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight text-white">
            {organizer.name}
          </h1>

          {organizer.role && (
            <p className="text-[#EB0028] text-sm sm:text-base md:text-lg lg:text-xl font-semibold uppercase tracking-wider mt-4 sm:mt-6">
              {organizer.role}
            </p>
          )}

          {/* الروابط */}
          <div className="mt-8 sm:mt-12 flex items-center gap-6 sm:gap-8 flex-wrap justify-center lg:justify-start">
            {normalizedLinkedin && (
              <Link
                href={normalizedLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                </svg>
                LinkedIn
              </Link>
            )}

            <PressKitShareButton
              name={organizer.name}
              isRtl={isRtl}
              className={actionClass}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M18 8a3 3 0 1 0-2.83-4H15A3 3 0 0 0 12 7c0 .12.01.23.03.34L7.9 9.72a3 3 0 1 0 0 4.56l4.13 2.38c-.02.11-.03.22-.03.34a3 3 0 1 0 3-3c-.65 0-1.24.2-1.74.53L9.14 11.6a3.07 3.07 0 0 0 0-1.2l4.12-2.37c.5.34 1.09.53 1.74.53Z" />
              </svg>
            </PressKitShareButton>
          </div>
        </div>
      </div>
    </section>
  );
}
