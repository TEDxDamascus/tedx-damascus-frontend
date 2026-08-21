import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import type { ApiEventDetail } from './EventDetailsClient';
import { localizeField } from './EventDetailsClient';

/* ─── Mock event shape (kept for generateStaticParams fallback) ─── */

export interface MockEvent {
  slug: string;
  titleRed: string;
  titleWhiteLines: string[];
  titleRedAr: string;
  titleWhiteLinesAr: string[];
  date: string;
  dateAr: string;
  location: string;
  locationAr: string;
  speakerHref: string;
  attendeeHref: string;
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    slug: 'from-war-to-big-dreams',
    titleRed: 'FROM WAR TO BIG DREAMS:',
    titleWhiteLines: ['SYRIAN ADULTS', 'DREW THEIR ROAD DESPITE', 'EVERY SINGLE OBSTACLE'],
    titleRedAr: 'من الحرب إلى الأحلام الكبيرة:',
    titleWhiteLinesAr: ['السوريون رسموا طريقهم', 'رغم كل العقبات'],
    date: 'January 16, 2024',
    dateAr: '16 يناير 2024',
    location: 'Damascus Opera House',
    locationAr: 'دار الأوبرا دمشق',
    speakerHref: '#',
    attendeeHref: '#',
  },
  {
    slug: 'tedx-damascus-2026',
    titleRed: 'DAMASCUS:',
    titleWhiteLines: ['WHERE THE STORY', 'IS TOLD ANEW'],
    titleRedAr: 'دمشق:',
    titleWhiteLinesAr: ['حيث تروى القصة', 'من جديد'],
    date: 'September 2026',
    dateAr: 'سبتمبر 2026',
    location: 'Damascus',
    locationAr: 'دمشق',
    speakerHref: '#',
    attendeeHref: '#',
  },
];

/* ─── Helpers ────────────────────────────────────────────── */

function isEventEnded(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  // The event is still "on" through the end of its own day.
  d.setHours(23, 59, 59, 999);
  return d.getTime() < Date.now();
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SY' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/* ─── Icons ──────────────────────────────────────────────── */

function CalendarIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
      <rect x="1" y="3" width="16" height="16" rx="2" stroke="white" strokeWidth="1.5" />
      <path d="M1 8h16" stroke="white" strokeWidth="1.5" />
      <path d="M5 1v4M13 1v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden>
      <path
        d="M8 1C4.686 1 2 3.686 2 7c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
        stroke="white"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="7" r="2" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Hero section ───────────────────────────────────────── */

interface EventDetailsHeroProps {
  locale: string;
  slug: string;
  event: ApiEventDetail | null;
}

export function EventDetailsHero({ locale, slug: _slug, event }: EventDetailsHeroProps) {
  const isRtl = locale === 'ar';

  const date = event ? formatDate(event.date, locale) : '';
  const location = event ? localizeField(event.location, locale) : '';
  const ended = event?.status === 'past' || isEventEnded(event?.date);

  // Brief is the hero title — fall back to static phrase if empty
  const BRIEF_FALLBACK = isRtl
    ? 'دمشق: حيث تروى الحكاية من جديد'
    : 'Damascus: where the story is told anew';
  const briefRaw = (event?.brief || '') || BRIEF_FALLBACK;
  const briefColonIdx = briefRaw.indexOf(':');

  return (
    <section
      className="relative flex min-h-[90vh] flex-col w-full overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background image */}
      <Image
        src="/images/events/event-details-bg.jpg"
        alt=""
        fill
        className="object-cover object-center pointer-events-none select-none"
        priority
        sizes="100vw"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" aria-hidden />

      {/* Navbar pinned at top */}
      <div className="relative z-20">
        <Navbar locale={locale} />
      </div>

      {/* Spacer — pushes content to the bottom */}
      <div className="flex-1" />

      {/* Content at bottom */}
      <div className="relative z-10 w-full px-[clamp(1.5rem,6vw,5.5rem)] pb-[80px]">
        <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8">

          {/* Brief as main title — text before ":" in primary, rest in white */}
          <div className="flex flex-col leading-none">
            {briefColonIdx !== -1 ? (
              <>
                <span className={[
                  'font-helvetica font-bold uppercase text-primary',
                  'text-[32px] leading-[1.15] tracking-[-0.25px]',
                  'sm:text-[44px] lg:text-[57px] lg:leading-[64px]',
                ].join(' ')}>
                  {briefRaw.slice(0, briefColonIdx + 1)}
                </span>
                <span className={[
                  'font-helvetica font-light uppercase text-white',
                  'text-[30px] leading-[1.2] tracking-[-0.5px]',
                  'sm:text-[44px] lg:text-[60px]',
                ].join(' ')}>
                  {briefRaw.slice(briefColonIdx + 1).trim()}
                </span>
              </>
            ) : (
              <span className={[
                'font-helvetica font-light uppercase text-white',
                'text-[30px] leading-[1.2] tracking-[-0.5px]',
                'sm:text-[44px] lg:text-[60px]',
              ].join(' ')}>
                {briefRaw}
              </span>
            )}
          </div>

          {/* Date + Location */}
          <div className="flex flex-wrap gap-6 pt-2">
            {date && (
              <div className="flex items-center gap-3">
                <CalendarIcon />
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-[#e7bdb7]">
                    {isRtl ? 'التاريخ' : 'DATE'}
                  </span>
                  <span className="font-sans text-[17px] font-bold text-white">
                    {date}
                  </span>
                </div>
              </div>
            )}
            {date && location && (
              <div className="hidden h-10 w-px bg-white/20 sm:block" aria-hidden />
            )}
            {location && (
              <div className="flex items-center gap-3">
                <LocationIcon />
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-[#e7bdb7]">
                    {isRtl ? 'الموقع' : 'LOCATION'}
                  </span>
                  <span className="font-sans text-[17px] font-bold text-white">
                    {location}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA buttons — hidden once the event has ended, there's nothing to apply to anymore */}
          {!ended && (
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="#"
                className={[
                  'inline-flex h-[60px] items-center justify-center px-10',
                  'bg-primary font-helvetica text-[16px] font-medium tracking-[0.46px] uppercase',
                  'text-[#f1f1f1] transition-opacity hover:opacity-90',
                ].join(' ')}
              >
                {isRtl ? 'التقدم كمتحدث' : 'APPLY AS A SPEAKER'}
              </Link>
              <Link
                href="#"
                className={[
                  'inline-flex h-[60px] items-center justify-center px-10',
                  'bg-black font-helvetica text-[16px] font-medium tracking-[0.46px] uppercase',
                  'text-[#f1f1f1] transition-opacity hover:opacity-90',
                ].join(' ')}
              >
                {isRtl ? 'التقدم كحضور' : 'APPLY AS AN ATTENDEE'}
              </Link>
            </div>
          )}

        </div>
        </div>
      </div>
    </section>
  );
}
