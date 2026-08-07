"use client";

export default function OrganizerHeroPattern() {
  return (
    <div className="absolute top-0 left-0 w-full h-[170px] z-0 overflow-hidden pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: "url('/images/partner-details/pattern.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 150px",
          backgroundPosition: "top",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#101010]" />
    </div>
  );
}
