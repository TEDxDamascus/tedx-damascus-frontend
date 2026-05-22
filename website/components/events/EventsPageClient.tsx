'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { EventCard } from './EventCard';

const PATTERN_SRC = '/images/about/pattern.svg';

const TOTAL_CARDS = 15;
const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 3;

interface EventsPageClientProps {
  locale: string;
}

export function EventsPageClient({ locale }: EventsPageClientProps) {
  const t = useTranslations('Events');
  const isRtl = locale === 'ar';
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const titleText = t('cardTitle');
  const filteredIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hay = titleText.toLowerCase();
    const match = !q || hay.includes(q);
    return Array.from({ length: TOTAL_CARDS }, (_, i) => i).filter(() => match);
  }, [query, titleText]);

  const shownIds = filteredIds.slice(0, visibleCount);
  const canLoadMore = shownIds.length < filteredIds.length;

  return (
    <>
      <section className="relative overflow-hidden bg-black pb-12 sm:pb-16 lg:pb-20">
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
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[24%]  via-black/55 to-black"
            aria-hidden
          />
        </div>

        {/* Small screens: same pattern band anchored under the hero (below title area) */}
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
                'font-helvetica text-4xl font-normal tracking-tight text-white sm:text-5xl ',
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

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
            {shownIds.map((id) => (
              <EventCard
                key={id}
                title={titleText}
                dateLabel={t('cardDate')}
                timeLabel={t('cardTime')}
                badge={t('cardBadge')}
                isRtl={isRtl}
              />
            ))}
          </div>

          {filteredIds.length === 0 && (
            <p className="mt-10 text-center text-secondary-200">{t('noResults')}</p>
          )}

          {canLoadMore && filteredIds.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, filteredIds.length))}
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
