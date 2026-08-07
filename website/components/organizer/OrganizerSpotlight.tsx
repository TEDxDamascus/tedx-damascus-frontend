"use client";
import { OrganizerViewData } from "@/lib/api/organizers";

interface OrganizerSpotlightProps {
  organizer?: OrganizerViewData;
  locale?: string;
}

export default function OrganizerSpotlight({
  organizer,
  locale = "en",
}: OrganizerSpotlightProps) {
  const gallery = organizer?.gallery || [];

  const imageUrls: string[] = gallery.filter(Boolean);

  if (!imageUrls || imageUrls.length === 0) return null;

  const isRtl = locale === "ar";

  const leftColumnImages = imageUrls.filter((_, idx) => idx % 2 === 0);
  const rightColumnImages = imageUrls.filter((_, idx) => idx % 2 === 1);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 my-16" dir={isRtl ? "rtl" : "ltr"}>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
          Organizer <span className="text-[#EB0028]">Spotlight</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        
        <div className="flex flex-col gap-4">
          {leftColumnImages.map((url, idx) => (
            <div key={`left-${idx}`} className="w-full overflow-hidden bg-neutral-900 border border-neutral-800/50">
              <img
                src={url}
                alt={`Spotlight ${idx * 2 + 1}`}
                className="w-full h-auto object-contain block"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {rightColumnImages.map((url, idx) => (
            <div key={`right-${idx}`} className="w-full overflow-hidden bg-neutral-900 border border-neutral-800/50">
              <img
                src={url}
                alt={`Spotlight ${idx * 2 + 2}`}
                className="w-full h-auto object-contain block"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}