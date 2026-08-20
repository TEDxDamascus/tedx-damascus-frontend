import React from "react";
import { notFound } from "next/navigation";
import { getAllOrganizers, getOrganizerById, formatOrganizer } from "@/lib/api/organizers";
import OrganizerDetails from "@/components/organizer/OrganizerDetails";
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
  // GET /organizer (the list) is public, so ids can be enumerated at build
  // time even though GET /organizer/:id itself requires login.
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
      <OrganizerDetails organizer={formattedOrganizer} locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}