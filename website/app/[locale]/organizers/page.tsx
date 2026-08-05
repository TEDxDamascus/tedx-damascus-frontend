"use client";

import React, { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import OrganizersHero from "@/components/organizers/OrganizersHero";
import OrganizersGrid from "@/components/organizers/OrganizersGrid";
import {
  organizersApi,
  OrganizerData,
  OrganizerViewData,
  MultiLangField,
} from "@/lib/api/organizers";

interface PageProps {
  params: Promise<{ locale: "en" | "ar" }>;
}

const getLangText = (
  field: MultiLangField | string | undefined,
  locale: "en" | "ar",
) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] || field.en || "";
};

const formatOrganizer = (
  data: OrganizerData,
  locale: "en" | "ar",
): OrganizerViewData => {
  const imageUrl =
    typeof data.image === "object" ? data.image?.url : data.image;

  return {
    _id: data._id,
    name: getLangText(data.name, locale),
    bio: getLangText(data.bio, locale),
    image: imageUrl || "",
    role: data.role || "",
    social_links: data.social_links || [],
  };
};

export default function OrganizersPage({ params }: PageProps) {
  const { locale } = use(params);
  const [organizers, setOrganizers] = useState<OrganizerViewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    organizersApi
      .getAll({ lang: locale })
      .then((res) => {
        const rawData = res?.data ?? [];
        const formatted = rawData.map((item: OrganizerData) =>
          formatOrganizer(item, locale),
        );
        setOrganizers(formatted);
      })
      .catch((err) => console.error("Error fetching organizers:", err))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <main className="min-h-screen bg-[#101010] text-white flex flex-col justify-between">
      <Navbar locale={locale} />

      <div className="flex-1">
        <OrganizersHero locale={locale} />
        <div className="mx-auto w-full px-6 md:px-12 pb-20">
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              Loading Organizers...
            </div>
          ) : (
            <OrganizersGrid locale={locale} organizers={organizers} />
          )}
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  );
}