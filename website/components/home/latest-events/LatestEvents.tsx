'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LatestEventsProps {
  locale: string;
}

const EVENT = {
  slug: 'speakers-2026',
  tagEn: 'Damascus where the story began',
  tagAr: 'دمشق حيث بدأت القصة',
  titleEn: 'From War to Big Dreams: Syrian Adults drew their road despite every single obstacle',
  titleAr: 'من الحرب إلى الأحلام الكبيرة: رسم البالغون السوريون طريقهم رغم كل العقبات',
  date: '16 Jan',
  dateAr: '١٦ يناير',
  time: '10 am - 4:00 pm',
  timeAr: '١٠ ص - ٤:٠٠ م',
};

export function LatestEvents({ locale }: LatestEventsProps) {
  const t = useTranslations('LatestEvents');
  const isRtl = locale === 'ar';

  return (
    <section
      className="w-full bg-[var(--page-bg)] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-[160px] py-10 gap-[22px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Title */}
      <h2
        className={`text-white text-[48px] font-normal leading-[72px] text-center break-words ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
      >
        {t('title')}
      </h2>

      {/* Card row */}
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 min-w-0 pb-4 relative bg-card-bg rounded-[18px] shadow-[0px_0px_23px_rgba(0,0,0,0.20)] flex flex-col items-center">

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/events/event-bg.jpg"
            alt=""
            className="w-full h-[240px] object-cover rounded-[13px] shrink-0"
            draggable={false}
            loading="lazy"
          />

          {/* Body */}
          <div className="w-full px-[22px] flex flex-col gap-[10px]">
            {/* Category */}
            <div className="w-full py-[6px] rounded-[20px] flex items-start">
              <p
                className={`text-primary text-[24px] font-bold leading-[32.02px] break-words ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {isRtl ? EVENT.tagAr : EVENT.tagEn}
              </p>
            </div>

            {/* Description + See more */}
            <div className="w-full flex items-center">
              <p
                className={`flex-1 min-w-0 text-[#F1F1F1] text-[16px] font-bold leading-[24px] tracking-[0.15px] break-words ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {isRtl ? EVENT.titleAr : EVENT.titleEn}
              </p>
              <Link
                href={`/${locale}/forms/${EVENT.slug}`}
                className={`shrink-0 w-[102px] h-[42px] border border-primary text-primary text-[16px] font-normal leading-[24px] tracking-[0.15px] flex items-center justify-center transition-colors hover:bg-primary/10 ${isRtl ? 'font-arabic ms-4' : 'font-helvetica ml-4'}`}
              >
                {t('seeMore')}
              </Link>
            </div>
          </div>

          {/* Date + time overlay — absolute top-left of image */}
          <div
            className={`absolute flex flex-col items-start ${isRtl ? 'right-[22px]' : 'left-[22px]'}`}
            style={{ top: 19 }}
          >
            <span
              className={`text-[#F1F1F1] text-[34px] font-medium leading-[41.99px] tracking-[0.25px] break-words overflow-hidden text-ellipsis whitespace-nowrap ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
            >
              {isRtl ? EVENT.dateAr : EVENT.date}
            </span>
            <div className="flex items-center gap-[3px]">
              {/* Calendar icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#A8A8A8" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.695 13.7H15.704M15.695 16.7H15.704M11.995 13.7H12.004M11.995 16.7H12.004M8.294 13.7H8.303M8.294 16.7H8.303" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                className={`text-[#A8A8A8] text-[14px] font-normal leading-[20.02px] tracking-[0.17px] whitespace-nowrap ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {isRtl ? EVENT.timeAr : EVENT.time}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
