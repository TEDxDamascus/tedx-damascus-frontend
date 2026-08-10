import React from "react";
import { notFound } from "next/navigation";
import {
  getOrganizerById,
  getAllOrganizers,
  OrganizerData,
} from "@/lib/api/organizers";
import OrganizerDetails from "@/components/organizer/OrganizerDetails";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface OrganizerDetailsPageProps {
  params: Promise<{
    locale: "en" | "ar";
    id: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ["en", "ar"];

  try {
    const organizers = await getAllOrganizers();

    return locales.flatMap((locale) =>
      organizers.map((organizer: OrganizerData) => ({
        locale,
        id: organizer._id,
      })),
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function OrganizerDetailsPage({
  params,
}: OrganizerDetailsPageProps) {
  const { locale, id } = await params;

  const organizer = await getOrganizerById(id, locale);

  if (!organizer) {
    notFound();
  }

  const nameString =
    typeof organizer.name === "object"
      ? organizer.name[locale] || organizer.name.en || ""
      : organizer.name;

  const bioString =
    typeof organizer.bio === "object"
      ? organizer.bio?.[locale] || organizer.bio?.en || ""
      : organizer.bio || "";

  const imageUrl =
    typeof organizer.image === "object"
      ? organizer.image.url
      : organizer.image || "";

  const galleryUrls: string[] = (organizer.gallery || [])
    .map((item) => (typeof item === "object" && item !== null ? item.url : item))
    .filter((url): url is string => Boolean(url));

  const formattedOrganizer = {
    _id: organizer._id,
    name: nameString,
    image: imageUrl,
    bio: bioString,
    social_links: organizer.social_links || [],
    role: organizer.role || "",
    gallery: galleryUrls,
  };

  return (
    <main className="min-h-screen bg-[#101010]">
      <Navbar locale={locale} />
      <OrganizerDetails organizer={formattedOrganizer} locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}