import React from "react";
import { notFound } from "next/navigation";
import { getAllOrganizers, getOrganizerById, formatOrganizer } from "@/lib/api/organizers";
import OrganizerDetailClient from "@/components/organizer/OrganizerDetailClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { routing } from "@/routing";

interface OrganizerDetailsPageProps {
  params: Promise<{
    locale: "en" | "ar";
    id: string;
  }>;
}

export async function generateStaticParams() {
  // The list endpoint (GET /organizer) is public, so we can still enumerate
  // real ids at build time even though the per-id endpoint (GET /organizer/:id)
  // requires login. Each shell renders from the public list data and then
  // upgrades to the authenticated response client-side once a session exists.
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    const organizers = await getAllOrganizers(locale);
    for (const organizer of organizers) {
      params.push({ locale, id: organizer._id });
    }
  }
  return params;
}

export default async function OrganizerDetailsPage({
  params,
}: OrganizerDetailsPageProps) {
  const { locale, id } = await params;

  const organizer = await getOrganizerById(id, locale);

  if (!organizer) {
    notFound();
  }

  const formattedOrganizer = formatOrganizer(organizer, locale);

  return (
    <main className="min-h-screen bg-[#101010]">
      <Navbar locale={locale} />
      <OrganizerDetailClient
        id={id}
        locale={locale}
        initialOrganizer={formattedOrganizer}
      />
      <Footer locale={locale} />
    </main>
  );
}