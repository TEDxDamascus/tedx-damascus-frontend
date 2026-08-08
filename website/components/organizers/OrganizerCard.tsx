"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OrganizerViewData } from "@/lib/api/organizers";

interface OrganizerCardProps {
  locale: "en" | "ar";
  organizer: OrganizerViewData;
}

export default function OrganizerCard({
  locale,
  organizer,
}: OrganizerCardProps) {
  const organizerId = organizer._id ;

  return (
    <Link
      href={`/${locale}/organizers/${organizerId}`}
      className="group relative flex flex-col w-full max-w-[320px] bg-[#121212] overflow-hidden rounded-none border border-transparent transition-all duration-300 cursor-pointer"
    >
      <div className="absolute top-0 left-0 z-20 w-4 h-4 border-t-4 border-l-4 border-[#EB0028] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative w-full h-[450px] bg-[#1a1a1a]">
        {organizer.image ? (
          <Image
            src={organizer.image}
            alt={organizer.name}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-5 text-left bg-[#1A1A1A] flex flex-col justify-center">
        <h3 className="text-xl font-extrabold tracking-wide text-white uppercase group-hover:text-[#EB0028] transition-colors">
          {organizer.name}
        </h3>
        {organizer.role && (
          <p className="text-xs font-medium text-[#EB0028] mt-1.5 uppercase tracking-wider">
            {organizer.role}
          </p>
        )}
      </div>
    </Link>
  );
}