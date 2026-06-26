import React from "react";
import PartnersHero from "@/components/partners/PartnersHero";
import PlatinumPartner from "@/components/partners/PlatinumPartner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import GoldenPartner from "@/components/partners/GoldenPartner";
import SilverPartner from "@/components/partners/SilverPartner";
import BronzePartner from "@/components/partners/BronzePartner";
import MediaPartner from "@/components/partners/MediaPartner";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#101010] text-white flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar locale={locale} />

        {/* Hero Section */}
        <PartnersHero locale={locale} />

        <div className=" mx-auto px-6 md:px-12 pb-20 w-full">
          <PlatinumPartner locale={locale} />
          <GoldenPartner locale={locale} />
          <SilverPartner locale={locale} />
          <BronzePartner locale={locale} />
          <MediaPartner locale={locale} />
        </div>
      </div>

      {/* Footer */}
      <Footer locale={locale} />
    </main>
  );
}
