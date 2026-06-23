import type { ApiEventDetail } from './EventDetailsClient';
import { localizeField } from './EventDetailsClient';

/* ─── Icons ──────────────────────────────────────────────── */

function LocationIcon() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden>
      <path d="M8 1C4.134 1 1 4.134 1 8c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z" stroke="#e62b1e" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.5" stroke="#e62b1e" strokeWidth="1.5" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="1" y="4" width="18" height="13" rx="2" stroke="#e62b1e" strokeWidth="1.5" />
      <path d="M1 7l9 6 9-6" stroke="#e62b1e" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden>
      <path
        d="M3.5 1h11a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"
        stroke="#e62b1e"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="18" r="1" fill="#e62b1e" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 1C6.134 1 3 4.134 3 8c0 4.9 7 11 7 11s7-6.1 7-11c0-3.866-3.134-7-7-7z" fill="white" />
      <circle cx="10" cy="8" r="2.5" fill="#e62b1e" />
    </svg>
  );
}

/* ─── Map ─────────────────────────────────────────────────── */

function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <iframe
      src={src}
      title="Event location"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
      loading="lazy"
    />
  );
}

function MapPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#121212]">
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <pattern id="map-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#555" strokeWidth="0.5" />
          </pattern>
          <pattern id="map-road-h" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="60" x2="120" y2="60" stroke="#666" strokeWidth="2" />
          </pattern>
          <pattern id="map-road-v" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="120" stroke="#666" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <rect width="100%" height="100%" fill="url(#map-road-h)" />
        <rect width="100%" height="100%" fill="url(#map-road-v)" />
        <line x1="0" y1="30%" x2="100%" y2="55%" stroke="#666" strokeWidth="2" />
        <line x1="0" y1="65%" x2="100%" y2="40%" stroke="#555" strokeWidth="1.5" />
        <line x1="25%" y1="0" x2="45%" y2="100%" stroke="#555" strokeWidth="1.5" />
        <line x1="60%" y1="0" x2="75%" y2="100%" stroke="#666" strokeWidth="2" />
      </svg>
      <button
        type="button"
        aria-label="View on map"
        className="relative z-10 flex h-12 w-12 items-center justify-center bg-primary transition-opacity hover:opacity-90"
      >
        <MapPinIcon />
      </button>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */

interface EventDetailsVenueProps {
  locale?: string;
  event: ApiEventDetail | null;
}

export function EventDetailsVenue({ locale, event }: EventDetailsVenueProps) {
  const isRtl = locale === 'ar';

  // coordinates: [longitude, latitude]
  const lng = event?.coordinates?.[0];
  const lat = event?.coordinates?.[1];
  const hasMap = typeof lat === 'number' && typeof lng === 'number';

  const venueName = event
    ? localizeField(event.location, locale)
    : (isRtl ? 'دار الأوبرا دمشق' : 'DAMASCUS OPERA HOUSE');

  const venueAddress = event
    ? localizeField(event.location_address, locale)
    : (isRtl ? 'ساحة الأمويين، دمشق، سوريا' : 'Umayyeen Square, Damascus, Syria');

  const venueDesc = event
    ? localizeField(event.location_description, locale)
    : (isRtl
        ? 'منارة للفن والثقافة في قلب دمشق. توفر بيئة رائعة تعكس موضوعنا.'
        : 'A beacon of art and culture in the heart of Damascus.');

  const email = event?.location_email ?? 'info@tedxdamascus.com';
  const phone = event?.location_phone ?? '';

  return (
    <section
      className="w-full bg-black px-[clamp(1.5rem,6vw,5.5rem)] py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-6">

          {/* ── Left: venue info ── */}
          <div className="flex flex-col justify-center gap-8">
            <h2 className="font-helvetica text-[40px] font-normal leading-[1.5] text-[#f1f1f1] lg:text-[48px]">
              {isRtl ? 'مكان الفعالية' : 'THE VENUE'}
            </h2>

            {venueName && (
              <h3 className="font-sans text-[22px] font-semibold uppercase text-primary lg:text-[24px]">
                {venueName}
              </h3>
            )}

            {venueDesc && (
              <p className="font-sans text-[16px] font-normal leading-[1.625] text-[#c6c6c7] lg:text-[18px]">
                {venueDesc}
              </p>
            )}

            <div className="flex flex-col gap-4 pt-2">
              {venueAddress && (
                <div className="flex items-center gap-4">
                  <LocationIcon />
                  <span className="font-sans text-[15px] font-normal text-white">
                    {venueAddress}
                  </span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-4">
                  <EmailIcon />
                  <span className="font-sans text-[15px] font-normal text-white">
                    {email}
                  </span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-4">
                  <PhoneIcon />
                  <span className="font-sans text-[15px] font-normal text-white">
                    {phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: map (non-interactive — overlay blocks zoom/pan) ── */}
          <div className="relative h-[340px] lg:h-[450px]">
            {hasMap ? (
              <>
                <MapEmbed lat={lat as number} lng={lng as number} />
                <div className="absolute inset-0 z-10" aria-hidden />
              </>
            ) : (
              <MapPlaceholder />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
