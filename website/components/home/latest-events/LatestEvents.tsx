'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface LatestEventsProps {
  locale: string;
}

const EVENT = {
  slug: 'speakers-2026',
  tagEn: 'TEDx Damascus 2026',
  tagAr: 'TEDx Damascus 2026',
  titleEn: 'Damascus... where the story is told anew',
  titleAr: 'دمشق... حيث تروى الحكاية من جديد',
  date: 'September',
  dateAr: 'سبتمبر',
};

export function LatestEvents({ locale }: LatestEventsProps) {
  const t = useTranslations('LatestEvents');
  const isRtl = locale === 'ar';

  return (
    <section
      className="w-full bg-[var(--page-bg)] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-[160px] pt-4 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 gap-[22px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Title */}
      <h2
        className={`text-white text-[28px] sm:text-[36px] lg:text-[48px] font-normal leading-tight sm:leading-[60px] lg:leading-[72px] text-center break-words ${'font-helvetica'}`}
      >
        {t('title')}
      </h2>

      {/* Card row */}
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 min-w-0 pb-4 relative bg-card-bg rounded-[18px] shadow-[0px_0px_23px_rgba(0,0,0,0.20)] flex flex-col items-center">

          {/* Image */}
          <Image
            src="/images/events/event-bg.png"
            alt=""
            width={1200}
            height={240}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
            className="w-full h-[160px] sm:h-[200px] lg:h-[240px] object-cover rounded-[13px] shrink-0"
            priority={false}
          />

          {/* Body */}
          <div className="w-full px-[22px] flex flex-col gap-[10px] mt-2">
            {/* Category */}
            <div className="w-full py-[6px] rounded-[20px] flex items-start">
              <p
                className={`text-primary text-[18px] sm:text-[20px] lg:text-[24px] font-bold leading-tight break-words ${'font-helvetica'}`}
              >
                {isRtl ? EVENT.tagAr : EVENT.tagEn}
              </p>
            </div>

            {/* Description + See more */}
            <div className="w-full flex items-center gap-3">
              <p
                className={`flex-1 min-w-0 text-[#F1F1F1] text-[14px] sm:text-[16px] font-bold leading-[24px] tracking-[0.15px] break-words ${'font-helvetica'}`}
              >
                {isRtl ? EVENT.titleAr : EVENT.titleEn}
              </p>
              <Link
                href={`/${locale}/forms/${EVENT.slug}`}
                className={`shrink-0 w-[90px] sm:w-[102px] h-[38px] sm:h-[42px] border border-primary text-primary text-[14px] sm:text-[16px] font-normal leading-[24px] tracking-[0.15px] flex items-center justify-center transition-colors hover:bg-primary/10 ${'font-helvetica'}`}
              >
                {t('seeMore')}
              </Link>
            </div>
          </div>

          {/* Date overlay — absolute top corner of image */}
          <div
            className={`absolute flex flex-col items-start ${isRtl ? 'right-[16px] sm:right-[22px]' : 'left-[16px] sm:left-[22px]'}`}
            style={{ top: 14 }}
          >
            <span
              className={`text-[#F1F1F1] text-[14px] sm:text-[16px] lg:text-[18px] font-medium leading-tight tracking-[0.25px] whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] ${'font-helvetica'}`}
            >
              {isRtl ? EVENT.dateAr : EVENT.date}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
