'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { eventsApi, getImageUrl } from '@/lib/api/client';
import { eventDetailHref } from '@/lib/event-slug';

/* ─── Types ─────────────────────────────────────────────── */

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

type LocaleString = string | { en?: string; ar?: string } | undefined;

function loc(field: LocaleString, lang: 'en' | 'ar'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.en ?? '';
}

function formatEventDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === 'ar' ? 'ar-SY' : 'en-US', {
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return dateStr;
  }
}

interface EventItem {
  id: string | number;
  slug: string;
  title: string;
  titleAr: string;
  date: string;
  bio: string;
  bioAr: string;
  isPast: boolean;
  image?: string;
}

/* ─── Card ───────────────────────────────────────────────── */

interface CardProps {
  event: EventItem;
  locale: string;
  viewDetails: string;
}

function EventCardHome({ event, locale, viewDetails }: CardProps) {
  const isRtl = locale === 'ar';
  const title = isRtl ? event.titleAr : event.title;
  const bio = isRtl ? event.bioAr : event.bio;
  const { isPast } = event;

  return (
    <div
      className="relative h-[352px] w-[280px] shrink-0 rounded-2xl overflow-hidden sm:rounded-none sm:overflow-visible"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Image — gradient vignette on all edges so no solid-square background shows */}
      <div className="relative h-[247px] w-full overflow-hidden bg-transparent">
        <Image
          src={getImageUrl(event.image)}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="280px"
        />
        {isPast && <div className="absolute inset-0 bg-black/50" />}
        {/* top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/60 to-transparent" aria-hidden />
        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden />
        {/* left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[25%] bg-gradient-to-r from-black/50 to-transparent" aria-hidden />
        {/* right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[25%] bg-gradient-to-l from-black/50 to-transparent" aria-hidden />
      </div>

      {/* Name + date — title left, date right, baseline-aligned */}
      <div className="absolute left-0 right-0 top-[258px] flex items-baseline justify-between gap-2">
        <span
          className={`font-helvetica text-[15px] font-medium leading-[1.2] tracking-[0.15px] flex-1 ${
            isPast ? 'text-[rgba(241,241,241,0.5)]' : 'text-primary'
          } ${isRtl ? 'font-arabic' : ''}`}
        >
          {title}
        </span>
        <span
          className={`font-helvetica text-[15px] font-medium leading-[1.2] tracking-[0.15px] shrink-0 ${
            isPast ? 'text-[rgba(241,241,241,0.5)]' : 'text-[#f1f1f1]'
          }`}
        >
          {event.date}
        </span>
      </div>

      {/* Bio */}
      <p
        className={`absolute left-0 right-0 top-[286px] text-[12px] font-bold leading-[1.57] tracking-[0.1px] line-clamp-2 ${
          isPast ? 'text-[rgba(168,168,168,0.5)]' : 'text-[#a8a8a8]'
        } ${isRtl ? 'font-arabic text-end' : 'font-helvetica'}`}
      >
        {bio}
      </p>

      {/* View details */}
      <Link
        href={eventDetailHref(locale, event.slug)}
        className="absolute left-0 right-0 top-[332px] flex items-center justify-center gap-1 font-helvetica text-[12px] font-bold leading-[1.57] tracking-[0.1px] text-primary hover:opacity-80 transition-opacity"
      >
        <span className={isRtl ? 'font-arabic' : ''}>{viewDetails}</span>
        <svg
          className="h-[14px] w-[14px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */

interface LatestEventsProps {
  locale: string;
}

export function LatestEvents({ locale }: LatestEventsProps) {
  const t = useTranslations('LatestEvents');
  const isRtl = locale === 'ar';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    eventsApi
      .getAll({ status: 'published', limit: 3 })
      .then((res: any) => {
        const raw: any[] = Array.isArray(res) ? res : (res?.data ?? []);
        if (raw.length === 0) { setEvents([]); return; }
        const normalized: EventItem[] = raw.map((e) => {
          const rawId = e._id ?? e.id ?? '';
          const enTitle = loc(e.title ?? e.name, 'en');
          return {
            id: rawId,
            slug: e.slug || toSlug(enTitle) || String(rawId),
            title: enTitle,
            titleAr: loc(e.title ?? e.name, 'ar') || enTitle,
            date: formatEventDate(e.date ?? e.startDate, locale),
            bio: loc(e.brief ?? e.description, 'en') || 'Damascus: where the story is told anew',
            bioAr: loc(e.brief ?? e.description, 'ar') || 'دمشق: حيث تُروى الحكاية من جديد',
            isPast: e.isPast ?? false,
            image: e.event_image ?? e.image ?? e.imageUrl,
          };
        });
        raw.forEach((e, i) => {
          try { localStorage.setItem(`tedx_event_${normalized[i].slug}`, JSON.stringify(e)); } catch {}
        });
        setEvents(normalized);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoaded(true));
  }, []);

  const cardProps = { locale, viewDetails: t('viewDetails') };

  // No mocked/placeholder events — once the fetch has settled, hide the
  // whole section rather than show fabricated content when the backend has
  // nothing to return.
  if (!loaded || events.length === 0) return null;

  return (
    <section
      className="w-full bg-[var(--page-bg)] pt-16 pb-8 lg:pt-20 lg:pb-14 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex w-full items-center px-[clamp(2rem,6vw,7.5rem)] gap-[40px] xl:gap-[60px]">
        <div className="flex shrink-0 flex-col items-start text-start w-[200px] xl:w-[240px]">
          <h2 className="font-helvetica text-[40px] xl:text-[48px] font-normal leading-[1.2] text-white">
            {t('title')}
          </h2>
          <p className="mt-3 font-helvetica text-[15px] xl:text-[16px] font-medium leading-[1.4] tracking-[0.15px] text-[#a8a8a8]">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex items-center justify-center gap-[48px] xl:gap-[56px]">
            {events.slice(0, 3).map((event) => (
              <EventCardHome key={event.slug} event={event} {...cardProps} />
            ))}
          </div>
          {/* Gradient fade from the outer edge of the cards — coming from the cards side */}
          <div
            className={[
              'pointer-events-none absolute inset-y-0 z-10 w-24',
              isRtl
                ? 'left-0 bg-gradient-to-r from-[var(--page-bg)] to-transparent'
                : 'right-0 bg-gradient-to-l from-[var(--page-bg)] to-transparent',
            ].join(' ')}
            aria-hidden
          />
        </div>

        <Link
          href={`/${locale}/events`}
          className="flex shrink-0 items-center justify-center text-primary hover:opacity-80 transition-opacity"
          aria-label={t('seeMore')}
        >
          <svg
            className="h-[44px] w-[44px]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex flex-col gap-8 lg:hidden">
        <div className="text-center">
          <h2 className="font-helvetica text-[32px] sm:text-[40px] font-normal leading-tight text-white">
            {t('title')}
          </h2>
          <p className="mt-2 font-helvetica text-[15px] sm:text-[17px] font-medium leading-[1.4] text-[#a8a8a8]">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:flex-wrap">
          {events.map((event) => (
            <EventCardHome key={event.slug} event={event} {...cardProps} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href={`/${locale}/events`}
            className="flex items-center gap-2 font-helvetica text-[15px] font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <span>{t('seeMore')}</span>
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
