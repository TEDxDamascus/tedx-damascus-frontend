"use client";

import React from "react";
import OrganizerCard from "./OrganizerCard";
import { OrganizerViewData } from "@/lib/api/organizers";

interface OrganizersGridProps {
  locale: "en" | "ar";
  organizers?: OrganizerViewData[];
}

export default function OrganizersGrid({
  locale,
  organizers = [],
}: OrganizersGridProps) {
  if (!organizers || organizers.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-sans">
        No organizers found.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-28 max-w-8xl mx-auto py-20">
      {organizers.map((organizer) => (
        <OrganizerCard
          key={organizer._id}
          locale={locale}
          organizer={organizer}
        />
      ))}
    </div>
  );
}
