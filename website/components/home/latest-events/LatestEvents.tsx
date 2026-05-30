'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LatestEventsProps {
  locale: string;
}

const EVENT = {
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
      className="w-full bg-[var(--page-bg)] flex flex-col items-center px-6 sm:px-12 lg:px-[160px] py-10 gap-[22px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Title */}
      <h2
        className={`text-white text-center text-[48px] font-normal leading-[1.5] ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
      >
        {t('title')}
      </h2>

      {/* Single event card */}
      <div className="w-full flex items-center justify-center">
        <div
          className="flex-1 min-w-0 flex flex-col items-center pb-4 relative rounded-[18px]"
          style={{ background: '#1a1a1a', boxShadow: '0px 0px 11.5px rgba(0,0,0,0.2)' }}
        >
          {/* Image */}
          <div className="h-[240px] w-full relative rounded-[13px] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/events/event-bg.jpg"
              alt=""
              className="absolute w-full max-w-none left-0"
              style={{ top: '-119.74%', height: '311.15%', objectFit: 'cover' }}
              draggable={false}
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-[13px]"
              style={{
                background: 'linear-gradient(179.89deg, rgba(0,0,0,0.5) 54.131%, rgb(26,26,26) 89.656%)',
              }}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-[10px] items-start px-[22px] w-full shrink-0">
            {/* Category */}
            <div className="py-[6px] w-full">
              <p
                className={`text-primary text-[24px] font-bold leading-[1.334] whitespace-nowrap ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {isRtl ? EVENT.tagAr : EVENT.tagEn}
              </p>
            </div>

            {/* Description + See more button row */}
            <div className="flex items-center w-full gap-4">
              <p
                className={`flex-1 min-w-0 text-[#f1f1f1] text-[16px] font-bold leading-[24px] tracking-[0.15px] ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {isRtl ? EVENT.titleAr : EVENT.titleEn}
              </p>
              <Link
                href={`/${locale}/events`}
                className={`shrink-0 border border-primary text-primary text-[16px] tracking-[0.15px] flex items-center justify-center w-[102px] h-[42px] transition-colors hover:bg-primary/10 ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {t('seeMore')}
              </Link>
            </div>
          </div>

          {/* Date + time overlay — top-left of image */}
          <div
            className="absolute flex flex-col items-start"
            style={{ left: 22, top: 19 }}
          >
            <span
              className={`text-[#f1f1f1] text-[34px] font-medium leading-[1.235] tracking-[0.25px] whitespace-nowrap overflow-hidden text-ellipsis ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
            >
              {isRtl ? EVENT.dateAr : EVENT.date}
            </span>
            <div className="flex items-center gap-[3px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/events/calendar.png"
                alt=""
                className="w-6 h-6 shrink-0 object-contain"
                draggable={false}
              />
              <span
                className={`text-[#a8a8a8] text-[14px] font-normal leading-[1.43] tracking-[0.17px] whitespace-nowrap ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
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
