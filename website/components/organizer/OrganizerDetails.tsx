import React from "react";
import { OrganizerViewData } from "@/lib/api/organizers";

import OrganizerHeroPattern from "./OrganizerHeroPattern";
import OrganizerProfileHero from "./OrganizerProfileHero";
import OrganizerBio from "./OrganizerBio";
import OrganizerSpotlight from "./OrganizerSpotlight";

interface OrganizerDetailsProps {
  organizer: OrganizerViewData;
  locale?: string;
}

export default function OrganizerDetails({
  organizer,
  locale,
}: OrganizerDetailsProps) {
  return (
    <div className="relative w-full bg-[#101010] text-white overflow-hidden">
      <OrganizerHeroPattern />
      <OrganizerProfileHero organizer={organizer} locale={locale} />
      <OrganizerBio organizer={organizer} locale={locale} />
      <OrganizerSpotlight organizer={organizer} locale={locale} />
    </div>
  );
}