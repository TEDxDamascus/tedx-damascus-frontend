'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { SpeakerCard } from './SpeakerCard';
import { speakersApi, getImageUrl } from '@/lib/api/client';

const PATTERN_SRC = '/images/about/pattern.svg';

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 12;

interface ApiSpeaker {
  _id?: string;
  id?: string | number;
  slug?: string;
  name?: string;
  nameAr?: string;
  role?: string;
  roleAr?: string;
  tagline?: string;
  taglineAr?: string;
  title?: string;
  titleAr?: string;
  bio?: string;
  bioAr?: string;
  speaker_image?: string;
  image?: string;
  imageUrl?: string;
  photo?: string;
  eventName?: string;
  eventNameAr?: string;
  event?: string | { name?: string; nameAr?: string; title?: string; titleAr?: string };
}

interface NormalizedSpeaker {
  id: string | number;
  slug: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  eventName: string;
  eventNameAr: string;
  imageUrl: string;
}

interface SpeakersPageClientProps {
  locale: string;
}

export function SpeakersPageClient({ locale }: SpeakersPageClientProps) {
  const t = useTranslations('Speakers');
  const isRtl = locale === 'ar';

  const [speakers, setSpeakers] = useState<NormalizedSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    speakersApi
      .getAll()
      .then((res: unknown) => {
        const raw: ApiSpeaker[] = Array.isArray(res) ? res : ((res as { data?: ApiSpeaker[] })?.data ?? []);
        const normalized: NormalizedSpeaker[] = raw.map((s) => {
          const eventObj = typeof s.event === 'object' && s.event !== null ? s.event : null;
          const rawId = s._id ?? s.id;
          return {
            id: rawId ?? '',
            slug: String(rawId),
            name: s.name ?? '',
            nameAr: s.nameAr ?? s.name ?? '',
            role: s.role ?? s.tagline ?? s.title ?? s.bio ?? '',
            roleAr: s.roleAr ?? s.taglineAr ?? s.titleAr ?? s.bioAr ?? s.role ?? s.tagline ?? '',
            eventName:
              s.eventName ??
              (typeof s.event === 'string' ? s.event : '') ??
              eventObj?.name ??
              eventObj?.title ??
              '',
            eventNameAr:
              s.eventNameAr ??
              eventObj?.nameAr ??
              eventObj?.titleAr ??
              s.eventName ??
              (typeof s.event === 'string' ? s.event : '') ??
              '',
            imageUrl: getImageUrl(s.speaker_image ?? s.image ?? s.imageUrl ?? s.photo ?? null),
          };
        });
        setSpeakers(normalized);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return speakers;
    return speakers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameAr.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.eventName.toLowerCase().includes(q)
    );
  }, [query, speakers]);

  const shown = filtered.slice(0, visibleCount);
  const canLoadMore = shown.length < filtered.length;

  return (
    <>
      <section className="relative overflow-hidden bg-black pb-12 sm:pb-16 lg:pb-20">
        {/* Pattern background – top */}
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

        {/* Pattern background – bottom (mobile only) */}
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
              {t('titleWord1') && <>{t('titleWord1')} </>}
              <span className="text-primary">{t('titleWord2')}</span>
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
              <span className="animate-pulse font-helvetica text-secondary-200">Loading...</span>
            </div>
          )}

          {/* Grid */}
          {!loading && shown.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {shown.map((speaker, i) => (
                <SpeakerCard
                  key={String(speaker.id ?? i)}
                  name={isRtl ? speaker.nameAr : speaker.name}
                  role={isRtl ? speaker.roleAr : speaker.role}
                  eventName={isRtl ? speaker.eventNameAr : speaker.eventName}
                  imageUrl={speaker.imageUrl}
                  isRtl={isRtl}
                  href={`/${locale}/speakers/${speaker.slug}`}
                />
              ))}
            </div>
          )}

          {/* Empty / error */}
          {!loading && shown.length === 0 && (
            <p className="mt-10 text-center text-secondary-200">
              {fetchError
                ? 'Could not load speakers. Please try again later.'
                : t('noResults')}
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
                  'border border-primary bg-transparent px-8 py-2.5 font-helvetica text-sm font-normal tracking-widest text-primary uppercase',
                  'transition-all hover:bg-primary/10 active:bg-primary/20',
                  isRtl ? 'font-arabic normal-case tracking-normal' : '',
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
