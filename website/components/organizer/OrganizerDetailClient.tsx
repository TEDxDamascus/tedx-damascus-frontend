"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  OrganizerData,
  OrganizerViewData,
  formatOrganizer,
  getOrganizerByIdAuth,
  hasAuthToken,
} from "@/lib/api/organizers";

import OrganizerHeroPattern from "./OrganizerHeroPattern";
import OrganizerProfileHero from "./OrganizerProfileHero";
import OrganizerBio from "./OrganizerBio";
import OrganizerSpotlight from "./OrganizerSpotlight";

interface OrganizerDetailClientProps {
  id: string;
  locale: "en" | "ar";
  initialOrganizer: OrganizerViewData;
}

// Renders instantly from the public-list fallback (initialOrganizer), then
// upgrades to the real GET /organizer/:id response once we know the visitor
// has a session — that endpoint requires login, and calling it without a
// token would trip the admin client's 401 handler and hard-redirect every
// anonymous visitor to /login.
export default function OrganizerDetailClient({
  id,
  locale,
  initialOrganizer,
}: OrganizerDetailClientProps) {
  const isRtl = locale === "ar";
  const [organizer, setOrganizer] = useState(initialOrganizer);
  // Starts false to match server-rendered markup; flipped in an effect
  // (client-only) so hydration never mismatches on localStorage state.
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!hasAuthToken()) return;
    setLoggedIn(true);
    let cancelled = false;

    getOrganizerByIdAuth(id)
      .then((data: OrganizerData) => {
        if (!cancelled && data) setOrganizer(formatOrganizer(data, locale));
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [id, locale]);

  const loginHref = `/${locale}/login?redirect=/${locale}/organizers/${id}`;

  return (
    <div className="relative w-full bg-[#101010] text-white overflow-hidden">
      <OrganizerHeroPattern />
      <OrganizerProfileHero organizer={organizer} locale={locale} />
      <OrganizerBio organizer={organizer} locale={locale} />
      <OrganizerSpotlight organizer={organizer} locale={locale} />

      {(!loggedIn || loadFailed) && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 text-center lg:text-left">
          <p
            className={[
              "text-white/30 text-xs font-helvetica",
              isRtl ? "font-arabic text-center" : "",
            ].join(" ")}
          >
            {loadFailed
              ? isRtl
                ? "تعذّر تحميل التفاصيل الكاملة. الرجاء تسجيل الدخول مجددًا."
                : "Couldn't load the full details. Please sign in again."
              : isRtl
                ? "سجّل الدخول لعرض أحدث بيانات المنظم مباشرة من الخادم."
                : "Sign in to load this organizer's live details from the server."}{" "}
            <Link
              href={loginHref}
              className="text-primary underline underline-offset-2 hover:text-white transition-colors"
            >
              {isRtl ? "تسجيل الدخول" : "Log in"}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
