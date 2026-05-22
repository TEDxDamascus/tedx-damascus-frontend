'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HISTORY_MOCK, type TimeFilter } from './data';

const COMMENTS_SRC = '/images/add-your-line/Comments.svg';
/** Public asset; filename contains a space */
const FILTER_CHEVRON_SRC = '/images/add-your-line/Chevron%20Down.svg';

const FILTER_OPTIONS: { value: TimeFilter; msg: 'filterAll' | 'filter30' | 'filter90' }[] = [
  { value: 'all', msg: 'filterAll' },
  { value: '30d', msg: 'filter30' },
  { value: '90d', msg: 'filter90' },
];

/** Figma: #E5E2E1 @ 40%, Inter 12/16 semibold, tracking 1.2px */
const HISTORY_CARD_META =
  'font-sans text-[12px] font-semibold leading-4 tracking-[1.2px] text-[#E5E2E1]/40';

/** Same horizontal rail as the card grid — title, filter, divider, and list share one column */
const HISTORY_CONTENT_RAIL = 'mx-auto w-full max-w-[min(100%,1270px)]';

interface QuestionHistoryProps {
  locale: string;
  selectedHistoryId: string | null;
  onSelectHistory: (id: string) => void;
}

export function QuestionHistory({ locale, selectedHistoryId, onSelectHistory }: QuestionHistoryProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [showAllPast, setShowAllPast] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const selectedFilterLabel = useMemo(() => {
    const opt = FILTER_OPTIONS.find((o) => o.value === timeFilter);
    return opt ? t(opt.msg) : t('filterAll');
  }, [timeFilter, t]);

  useEffect(() => {
    if (!filterOpen) return;
    function handlePointerDown(e: MouseEvent) {
      const el = filterRef.current;
      if (el && !el.contains(e.target as Node)) setFilterOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFilterOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [filterOpen]);

  const filteredHistory = useMemo(() => {
    if (timeFilter === 'all') return HISTORY_MOCK;
    if (timeFilter === '30d') return HISTORY_MOCK.filter((h) => h.bucket === '30d');
    return HISTORY_MOCK.filter((h) => h.bucket === '30d' || h.bucket === '90d');
  }, [timeFilter]);

  const visibleHistory = showAllPast ? filteredHistory : filteredHistory.slice(0, 4);

  return (
      <section className="bg-black px-6 sm:px-12 lg:px-[80px] py-16 lg:py-4">
      <div className="max-w-[1440px] mx-auto">
        <div className={HISTORY_CONTENT_RAIL}>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h2 className="inline-block font-helvetica font-bold text-xs sm:text-sm tracking-[0.12em] uppercase text-primary">
              <span className="border-b-2 border-primary pb-1">{t('historyTitleFirst')}</span>
              <span>{t('historyTitleSecond')}</span>
            </h2>
          </div>

          <div className={`mt-8 flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
            <div
              className={['relative inline-block w-full', isRtl ? 'max-w-[min(100%,170px)]' : 'max-w-[min(100%,150px)]'].join(' ')}
              ref={filterRef}
            >
              <button
                type="button"
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
                aria-label={t('filterLabel')}
                onClick={() => setFilterOpen((o) => !o)}
                className={[
                  'flex w-full min-w-0 items-center min-h-[42px]',
                  'gap-2 bg-transparent border border-secondary rounded-none',
                  'ps-4 pe-10 py-2.5 text-start text-xs font-bold tracking-wide text-white',
                  'cursor-pointer hover:border-primary transition-colors',
                  isRtl ? 'normal-case font-arabic leading-normal' : 'uppercase font-helvetica',
                ].join(' ')}
              >
                <span className="min-w-0 flex-1 truncate">{selectedFilterLabel}</span>
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FILTER_CHEVRON_SRC}
                alt=""
                width={10}
                height={10}
                className={[
                  'pointer-events-none absolute top-1/2 -translate-y-1/2 end-3 shrink-0 opacity-80 transition-transform duration-200',
                  filterOpen ? 'rotate-180' : '',
                ].join(' ')}
                draggable={false}
                aria-hidden
              />
              {filterOpen && (
                <ul
                  role="listbox"
                  className="absolute start-0 z-50 mt-1 w-full min-w-full border border-border bg-card-bg py-1 shadow-lg"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <li key={opt.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={timeFilter === opt.value}
                        className={[
                          'flex w-full px-4 py-2.5 text-start text-xs font-bold tracking-wide transition-colors',
                          timeFilter === opt.value
                            ? 'bg-tertiary-mid text-white'
                            : 'text-white hover:bg-tertiary hover:text-white',
                          isRtl ? 'normal-case font-arabic leading-normal' : 'uppercase font-helvetica',
                        ].join(' ')}
                        onClick={() => {
                          setTimeFilter(opt.value);
                          setShowAllPast(false);
                          setFilterOpen(false);
                        }}
                      >
                        {t(opt.msg)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-border" aria-hidden />

          <ul
            className={[
              'mt-10 grid w-full max-w-[1200px] grid-cols-1 sm:grid-cols-2 gap-8',
              'justify-items-center sm:justify-items-stretch',
            ].join(' ')}
          >
            {visibleHistory.map((item) => (
              <li key={item.id} className="w-full max-w-[580px] justify-self-center sm:max-w-none sm:justify-self-stretch">
                <button
                  type="button"
                  onClick={() => onSelectHistory(item.id)}
                  aria-pressed={selectedHistoryId === item.id}
                  className={[
                    'w-full h-full min-h-[200px] text-start p-6 sm:p-8 flex flex-col gap-4 transition-colors',
                    'border border-transparent bg-transparent cursor-pointer',
                    'hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                    selectedHistoryId === item.id ? 'border-primary ring-1 ring-primary/40' : '',
                  ].join(' ')}
                >
                  <p
                    className={[
                      HISTORY_CARD_META,
                      isRtl ? 'normal-case font-arabic' : 'uppercase',
                    ].join(' ')}
                  >
                    {t('weekNumber', { n: item.week })}
                  </p>
                  <p
                    className={`text-white text-lg sm:text-xl font-semibold leading-snug flex-1 ${isRtl ? 'font-arabic text-right' : 'font-helvetica'}`}
                  >
                    {t(item.questionKey)}
                  </p>
                  <div
                    className={[
                      'flex items-center gap-2',
                      HISTORY_CARD_META,
                      isRtl ? 'flex-row-reverse normal-case font-arabic' : 'uppercase',
                    ].join(' ')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={COMMENTS_SRC}
                      alt=""
                      width={12}
                      height={12}
                      className="shrink-0 opacity-40"
                      draggable={false}
                    />
                    <span>{t('responses', { count: item.responses })}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {filteredHistory.length === 0 && (
            <p className={`mt-8 text-secondary-200 ${isRtl ? 'font-arabic text-right' : 'font-helvetica'}`}>
              {t('noResults')}
            </p>
          )}

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllPast((v) => !v)}
              className={[
                'group relative text-white text-xs sm:text-sm font-bold uppercase tracking-[0.15em]',
                'pb-12 border-b-2 border-transparent hover:border-primary transition-colors',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              <span className="border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">
                {showAllPast ? t('showLessPast') : t('viewAllPast')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
