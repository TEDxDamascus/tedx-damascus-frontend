'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { EventCard } from './EventCard';
import { eventsApi } from '@/lib/api/client';

const PATTERN_SRC = '/images/about/pattern.svg';

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function formatEventDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleDateString(locale === 'ar' ? 'ar-SY' : 'en-US', { month: 'long' });
    return `${day} ${month}`;
  } catch {
    return dateStr;
  }
}
const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 3;

interface ApiEvent {
  id: string | number;
  slug?: string;
  title?: string;
  name?: string;
  titleAr?: string;
  nameAr?: string;
  date?: string;
  startDate?: string;
  startTime?: string;
  time?: string;
  category?: string;
  badge?: string;
  bio?: string;
  bioAr?: string;
  tagline?: string;
  taglineAr?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
}

interface NormalizedEvent {
  id: string | number;
  slug: string;
  title: string;
  titleAr: string;
  dateLabel: string;
  timeLabel: string;
  badge: string;
  bio: string;
  bioAr: string;
}

interface EventsPageClientProps {
  locale: string;
}

export function EventsPageClient({ locale }: EventsPageClientProps) {
  const t = useTranslations('Events');
  const isRtl = locale === 'ar';

  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    eventsApi
      .getAll({ status: 'published' })
      .then((res: any) => {
        const raw: ApiEvent[] = Array.isArray(res) ? res : (res?.data ?? []);
        const normalized: NormalizedEvent[] = raw.map((e) => ({
          id: e.id,
          slug: (e.slug ?? toSlug(e.title ?? e.name ?? '')) || String(e.id),
          title: e.title ?? e.name ?? t('cardTitle'),
          titleAr: e.titleAr ?? e.nameAr ?? e.title ?? e.name ?? t('cardTitle'),
          dateLabel: formatEventDate(e.date ?? e.startDate, locale) || t('cardDate'),
          timeLabel: e.time ?? e.startTime ?? t('cardTime'),
          badge: e.category ?? e.badge ?? t('cardBadge'),
          bio: e.bio ?? e.tagline ?? e.shortDescription ?? '',
          bioAr: e.bioAr ?? e.taglineAr ?? e.bio ?? e.tagline ?? e.shortDescription ?? '',
        }));
        raw.forEach((e, i) => {
          try { localStorage.setItem(`tedx_event_${normalized[i].slug}`, JSON.stringify(e)); } catch {}
        });
        setEvents(normalized);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.titleAr.toLowerCase().includes(q) ||
        e.badge.toLowerCase().includes(q)
    );
  }, [query, events]);

  const shown = filtered.slice(0, visibleCount);
  const canLoadMore = shown.length < filtered.length;

  return (
    <>
      <section className="relative overflow-hidden bg-black pb-12 sm:pb-16 lg:pb-20">
        {/* Pattern background */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden bg-black"
          aria-hidden
        >
          <div className="relative mx-auto aspect-[1440/398] w-full max-h-[min(398px,52vh)] max-w-[1440px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PATTERN_SRC}
              alt=""
              width={1440}
              height={398}
              className={[
                'absolute inset-0 h-[300px] w-full select-none object-cover object-top',
                isRtl ? 'scale-x-[-1]' : '',
              ].join(' ')}
              draggable={false}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[24%] bg-gradient-to-b from-transparent via-black/55 to-black"
            aria-hidden
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(220px,38vh)] overflow-hidden md:hidden"
          aria-hidden
        >
          <div className="relative mx-auto h-full max-w-[1440px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PATTERN_SRC}
              alt=""
              width={1440}
              height={398}
              className={[
                'absolute inset-x-0 bottom-0 h-[min(320px,55vh)] w-full select-none object-cover object-bottom',
                isRtl ? 'scale-x-[-1]' : '',
              ].join(' ')}
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[65%] bg-gradient-to-b from-black via-black/70 to-transparent"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1180px] px-[clamp(1rem,10vw,7.5rem)] pt-32 text-center sm:pt-36 lg:pt-40">
            <h1
              className={[
                'font-helvetica text-4xl font-normal tracking-tight text-white sm:text-5xl',
                isRtl ? 'font-arabic' : '',
              ].join(' ')}
            >
              {t('title')}
            </h1>
          </div>
        </div>
      </section>

      <section
        className="bg-black px-[clamp(1rem,10vw,7.5rem)] pb-20 pt-16"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto w-full max-w-[1180px]">
          {/* Search */}
          <div className="relative mx-auto mb-10 w-full max-w-[min(100%,80rem)] sm:mb-12">
            <Search
              className="pointer-events-none absolute start-5 top-1/2 z-[1] h-[22px] w-[22px] -translate-y-1/2 text-primary"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(INITIAL_VISIBLE);
              }}
              placeholder={t('searchPlaceholder')}
              className={[
                'w-full rounded-lg border border-white/[0.08] bg-card-bg py-3.5 pe-5 ps-12 font-sans text-base text-white outline-none',
                'placeholder:text-secondary-200',
                'transition-[box-shadow,border-color] focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/25',
                'text-start',
              ].join(' ')}
              aria-label={t('searchPlaceholder')}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <span className="font-helvetica text-secondary-200 animate-pulse">
                Loading...
              </span>
            </div>
          )}

          {/* Grid */}
          {!loading && shown.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
              {shown.map((event, i) => (
                <EventCard
                  key={String(event.id ?? i)}
                  title={isRtl ? event.titleAr : event.title}
                  dateLabel={event.dateLabel}
                  timeLabel={event.timeLabel}
                  badge={event.badge}
                  bio={isRtl ? event.bioAr : event.bio}
                  isRtl={isRtl}
                  href={`/${locale}/events/${event.slug}`}
                />
              ))}
            </div>
          )}

          {/* Empty / error */}
          {!loading && shown.length === 0 && (
            <p className="mt-10 text-center text-secondary-200">
              {fetchError ? 'Could not load events. Please try again later.' : t('noResults')}
            </p>
          )}

          {/* Load more */}
          {canLoadMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, filtered.length))
                }
                className={[
                  'rounded-xs bg-primary px-6 py-3 font-helvetica text-md font-normal tracking-wide text-black',
                  'transition-opacity hover:opacity-90 active:opacity-80',
                  isRtl ? 'font-arabic normal-case' : '',
                ].join(' ')}
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </>
  );
}
