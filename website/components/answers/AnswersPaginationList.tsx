'use client';

import { useTranslations } from 'next-intl';
import type { AnswerItem } from './data';

const QUOTES_SRC = '/images/add-your-line/double-quotes.svg';
const ARROW_LEFT_SRC = '/images/add-your-line/arrow-left.svg';
const ARROW_RIGHT_SRC = '/images/add-your-line/arrow-right.svg';

interface AnswersPaginationListProps {
  locale: string;
  answerPages: AnswerItem[][];
  pageIndex: number;
  onPageIndexChange: (index: number) => void;
}

export function AnswersPaginationList({
  locale,
  answerPages,
  pageIndex,
  onPageIndexChange,
}: AnswersPaginationListProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';

  const pageCount = Math.max(1, answerPages.length);
  const safeIndex = Math.min(pageIndex, pageCount - 1);
  const currentAnswers = answerPages[safeIndex] ?? answerPages[0] ?? [];

  const prevArrowSrc = isRtl ? ARROW_RIGHT_SRC : ARROW_LEFT_SRC;
  const nextArrowSrc = isRtl ? ARROW_LEFT_SRC : ARROW_RIGHT_SRC;

  function goPrev() {
    onPageIndexChange(safeIndex <= 0 ? pageCount - 1 : safeIndex - 1);
  }

  function goNext() {
    onPageIndexChange(safeIndex >= pageCount - 1 ? 0 : safeIndex + 1);
  }

  return (
    <div className="flex min-h-0 max-w-[480px] flex-col">
      <ul className="w-full">
        {currentAnswers.map((item, index) => (
          <li
            key={item.id}
            className={[
              'py-8',
              index < currentAnswers.length - 1 ? 'border-b border-[#2A2A2A]' : '',
              /* Stagger: 1st & 3rd flush, 2nd (and every even 1-based step) inset — margin-inline-start mirrors in RTL */
              index % 2 === 1 ? 'ms-8 sm:ms-12 lg:ms-[4.5rem]' : '',
            ].join(' ')}
          >
            {/* Bar + quote: 0 gap between line and glyph; gap-2 only before body text */}
            <div className="flex min-w-0 flex-1 flex-row items-stretch gap-2">
              <div className="flex shrink-0 flex-row items-stretch gap-0">
                <div className="w-[2px] shrink-0 self-stretch bg-primary rounded-none" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QUOTES_SRC}
                  alt=""
                  width={24}
                  height={20}
                  className="block shrink-0 self-start pb-4 pr-2"
                  draggable={false}
                />
              </div>
              <p
                className={[
                  'min-w-0 flex-1 text-white text-base leading-[1.625] tracking-[0.01em]',
                  isRtl ? 'font-arabic text-right' : 'font-helvetica font-normal',
                ].join(' ')}
              >
                {t(item.textKey)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex w-full flex-row items-center justify-center gap-6">
        <button
          type="button"
          onClick={goPrev}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] border border-[#2A2A2A] hover:bg-[#353535] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={t('prevPage')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prevArrowSrc} alt="" width={6} height={12} draggable={false} />
        </button>

        <nav className="flex items-center gap-[10px]" aria-label={t('paginationLabel')}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-current={safeIndex === i ? 'page' : undefined}
              aria-label={t('goToPage', { page: i + 1 })}
              onClick={() => onPageIndexChange(i)}
              className={[
                'size-1.5 rounded-full transition-all',
                safeIndex === i ? 'bg-primary scale-125' : 'bg-[#454747] hover:bg-secondary-300',
              ].join(' ')}
            />
          ))}
        </nav>

        <button
          type="button"
          onClick={goNext}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] border border-[#2A2A2A] hover:bg-[#353535] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={t('nextPage')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={nextArrowSrc} alt="" width={6} height={12} draggable={false} />
        </button>
      </div>
    </div>
  );
}
