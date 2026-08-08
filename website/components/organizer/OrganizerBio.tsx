"use client";
import { OrganizerViewData, MultiLangField } from "@/lib/api/organizers";

interface OrganizerBioProps {
  organizer?:
    | OrganizerViewData
    | {
        bio?: MultiLangField | string;
        name?: MultiLangField | string;
      };
  bio?: MultiLangField | string;
  name?: string;
  locale?: string;
}

export default function OrganizerBio({
  bio,
  name,
  organizer,
  locale = "en",
}: OrganizerBioProps) {
  const rawBio = bio ?? organizer?.bio;
  const rawName = name ?? organizer?.name;

  const bioText =
    typeof rawBio === "object"
      ? rawBio[locale as keyof MultiLangField] || rawBio.en || rawBio.ar || ""
      : rawBio || "";

  const displayName =
    typeof rawName === "object"
      ? rawName[locale as keyof MultiLangField] ||
        rawName.en ||
        rawName.ar ||
        ""
      : rawName || "";

  if (!bioText) return null;

  const isRtl = locale === "ar";

  return (
    <section
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 my-8 sm:my-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative bg-[#1C1B1B] border border-[#1C1B1B] p-5 sm:p-10 md:p-12 overflow-hidden">
        <span
          className="hidden xl:block absolute right-6 top-0 text-7xl sm:text-8xl md:text-6xl font-serif font-extrabold text-[#E5E2E1]/10 select-none pointer-events-none leading-none"
          aria-hidden="true"
        >
          99
        </span>

        <h2 className="text-xs sm:text-base font-semibold tracking-widest text-[#EB0028] uppercase mb-3 sm:mb-4">
          {isRtl
            ? `من هو ${displayName || "المنظم"}؟`
            : `WHO IS ${displayName || "ORGANIZER"}?`}
        </h2>

        <div className="relative z-10 text-[#A8A8A8] text-sm sm:text-[19px] leading-relaxed space-y-3 sm:space-y-4 font-light">
          {bioText.split("\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
