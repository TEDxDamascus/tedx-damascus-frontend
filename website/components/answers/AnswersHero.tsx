'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout';
import type { PastQuestionMsgKey } from './data';

const PATTERN_SRC = '/images/about/pattern.svg';

export type HistoryHeroQuestion = {
  week: number;
  questionKey: PastQuestionMsgKey;
  responses: number;
};

interface AnswersHeroProps {
  locale: string;
  children: ReactNode;
  /** When set, hero shows this archived prompt instead of the current weekly headline. */
  historyQuestion?: HistoryHeroQuestion | null;
  onClearHistorySelection?: () => void;
}

export function AnswersHero({
  locale,
  children,
  historyQuestion = null,
  onClearHistorySelection,
}: AnswersHeroProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';
  const isHistory = Boolean(historyQuestion);

  return (
    <section id="weekly-answers" className="relative overflow-hidden bg-black pb-24">
      {/* About pattern: 1440×398 artwork, anchored behind the navbar like the design */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-0 overflow-hidden bg-black"
        aria-hidden
      >
        <div className="relative mx-auto aspect-[1440/398] w-full max-h-[min(398px,52vh)] max-w-[1440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PATTERN_SRC}
            alt=""
            width={1440}
            height={236}
            className={[
              'absolute inset-0 h-[200px] w-full object-cover object-top select-none',
              isRtl ? 'scale-x-[-1]' : '',
            ].join(' ')}
            draggable={false}
          />
        </div>
        {/* Fade pattern into page black (picture 2) */}
        <div
          className="absolute inset-x-0 bottom-0 top-[24%] via-black/55 to-black pointer-events-none"
          aria-hidden
        />
      </div>

      <div className="relative z-10">
        <Navbar locale={locale} />

        <div
          className={[
            'max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[80px]',
            'pt-36 lg:pt-[280px] lg:pb-0',
            'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-32 lg:gap-y-0 items-start',
          ].join(' ')}
        >
          <div className={isRtl ? 'lg:text-right' : 'lg:text-left'}>
            {isHistory && historyQuestion ? (
              <>
                <p
                  className={[
                    'text-primary font-s text-[12px] tracking-[0.12em] mb-2',
                    isRtl ? 'font-arabic normal-case' : 'font-helvetica uppercase',
                  ].join(' ')}
                >
                  {t('weekNumber', { n: historyQuestion.week })}
                </p>
                <p
                  className={[
                    'text-secondary-200 text-xs font-bold uppercase tracking-wider mb-4',
                    isRtl ? 'font-arabic normal-case' : 'font-helvetica',
                  ].join(' ')}
                >
                  {t('totalResponses', { count: historyQuestion.responses })}
                </p>
                <h1
                  className={[
                    'max-w-[520px] font-semibold text-2xl sm:text-3xl lg:text-[38px] lg:leading-[1.35] tracking-tight text-white mb-5',
                    isRtl ? 'font-arabic' : 'font-helvetica',
                  ].join(' ')}
                >
                  {t(historyQuestion.questionKey)}
                </h1>
                <p
                  className={[
                    'text-white text-base leading-[1.625] max-w-[400px] mb-6',
                    isRtl ? 'font-arabic mr-0 ml-auto' : 'font-helvetica font-normal',
                  ].join(' ')}
                >
                  {t('pastQuestionBrowse')}
                </p>
                {onClearHistorySelection && (
                  <button
                    type="button"
                    onClick={onClearHistorySelection}
                    className={[
                      'text-primary text-xs font-bold tracking-[0.12em] uppercase border-b-2 border-primary pb-1',
                      'hover:text-white hover:border-white transition-colors',
                      isRtl ? 'font-arabic normal-case tracking-normal' : 'font-helvetica',
                    ].join(' ')}
                  >
                    {t('backToCurrentQuestion')}
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-primary font-helvetica font-s text-[12px] tracking-[0.12em] uppercase mb-5">
                  {t('weeklyLabel')}
                </p>
                <h1
                  className={[
                    'font-helvetica max-w-[420px] font-semibold text-3xl sm:text-4xl lg:text-[42px] lg:leading-[1.30] tracking-tight mb-5',
                    isRtl ? 'font-arabic' : '',
                  ].join(' ')}
                >
                  <span className="text-white">{t('headlineStart')} </span>
                  <span className="text-primary ">{t('headlineCity')}</span>
                  <span className="text-white "> {t('headlineEnd')}</span>
                  <span className="text-primary">{t('headlineQuestionMark')}</span>
                </h1>
                <p
                  className={[
                    'text-white text-base leading-[1.625] max-w-[400px]',
                    isRtl ? 'font-arabic mr-0 ml-auto' : 'font-helvetica font-normal',
                  ].join(' ')}
                >
                  {t('weeklyDescription')}
                </p>
              </>
            )}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
