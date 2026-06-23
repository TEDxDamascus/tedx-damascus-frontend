'use client';

import { useTranslations } from 'next-intl';
import type { AnswerItem } from './data';

const QUOTES_SRC = '/images/add-your-line/double-quotes.svg';
const ARROW_LEFT_SRC = '/images/add-your-line/arrow-left.svg';
const ARROW_RIGHT_SRC = '/images/add-your-line/arrow-right.svg';

interface AnswersPaginationListProps {
  locale: string;
  answers: AnswerItem[];
  pageIndex: number;
  pageCount: number;
  onPageIndexChange: (index: number) => void;
  isLoading?: boolean;
}

export function AnswersPaginationList({
  locale,
  answers,
  pageIndex,
  pageCount,
  onPageIndexChange,
  isLoading = false,
}: AnswersPaginationListProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';

  const safePageCount = Math.max(1, pageCount);
  const safeIndex = Math.min(pageIndex, safePageCount - 1);

  const prevArrowSrc = isRtl ? ARROW_RIGHT_SRC : ARROW_LEFT_SRC;
  const nextArrowSrc = isRtl ? ARROW_LEFT_SRC : ARROW_RIGHT_SRC;

  function goPrev() {
    onPageIndexChange(safeIndex <= 0 ? safePageCount - 1 : safeIndex - 1);
  }

  function goNext() {
    onPageIndexChange(safeIndex >= safePageCount - 1 ? 0 : safeIndex + 1);
  }

  return (
    <div className="flex min-h-0 max-w-[480px] flex-col">
      {isLoading ? (
        <p
          className={`py-8 text-secondary-200 text-base ${isRtl ? 'font-arabic text-right' : 'font-helvetica'}`}
        >
          {t('loadingAnswers')}
        </p>
      ) : answers.length === 0 ? (
        <p
          className={`py-8 text-secondary-200 text-base ${isRtl ? 'font-arabic text-right' : 'font-helvetica'}`}
        >
          {t('noAnswersYet')}
        </p>
      ) : (
        <ul className="w-full">
          {answers.map((item, index) => (
            <li
              key={item.id}
              className={[
                'py-8',
                index < answers.length - 1 ? 'border-b border-[#2A2A2A]' : '',
                index % 2 === 1 ? 'ms-8 sm:ms-12 lg:ms-[4.5rem]' : '',
              ].join(' ')}
            >
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
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 flex w-full flex-row items-center justify-center gap-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={isLoading}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] border border-[#2A2A2A] hover:bg-[#353535] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40"
          aria-label={t('prevPage')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prevArrowSrc} alt="" width={6} height={12} draggable={false} />
        </button>

        <nav className="flex items-center gap-[10px]" aria-label={t('paginationLabel')}>
          {Array.from({ length: safePageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-current={safeIndex === i ? 'page' : undefined}
              aria-label={t('goToPage', { page: i + 1 })}
              onClick={() => onPageIndexChange(i)}
              disabled={isLoading}
              className={[
                'size-1.5 rounded-full transition-all',
                safeIndex === i ? 'bg-primary scale-125' : 'bg-[#454747] hover:bg-secondary-300',
                isLoading ? 'opacity-40' : '',
              ].join(' ')}
            />
          ))}
        </nav>

        <button
          type="button"
          onClick={goNext}
          disabled={isLoading}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] border border-[#2A2A2A] hover:bg-[#353535] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40"
          aria-label={t('nextPage')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={nextArrowSrc} alt="" width={6} height={12} draggable={false} />
        </button>
      </div>
    </div>
  );
}
