'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LatestEventsProps {
  locale: string;
}

const EVENTS = [
  {
    id: 1,
    tagEn: 'Damascus where the story began',
    tagAr: 'دمشق حيث بدأت القصة',
    titleEn: 'From War to Big Dreams: Syrian Adults drew their road despite every single obstacle',
    titleAr: 'من الحرب إلى الأحلام الكبيرة: رسم البالغون السوريون طريقهم رغم كل العقبات',
    date: '16 Jan',
    dateAr: '١٦ يناير',
    time: '10 am - 4:00 pm',
    timeAr: '١٠ ص - ٤:٠٠ م',
  },
  {
    id: 2,
    tagEn: 'Damascus where the story began',
    tagAr: 'دمشق حيث بدأت القصة',
    titleEn: 'From War to Big Dreams: Syrian Adults drew their road despite every single obstacle',
    titleAr: 'من الحرب إلى الأحلام الكبيرة: رسم البالغون السوريون طريقهم رغم كل العقبات',
    date: '16 Jan',
    dateAr: '١٦ يناير',
    time: '10 am - 4:00 pm',
    timeAr: '١٠ ص - ٤:٠٠ م',
  },
  {
    id: 3,
    tagEn: 'Damascus where the story began',
    tagAr: 'دمشق حيث بدأت القصة',
    titleEn: 'From War to Big Dreams: Syrian Adults drew their road despite every single obstacle',
    titleAr: 'من الحرب إلى الأحلام الكبيرة: رسم البالغون السوريون طريقهم رغم كل العقبات',
    date: '16 Jan',
    dateAr: '١٦ يناير',
    time: '10 am - 4:00 pm',
    timeAr: '١٠ ص - ٤:٠٠ م',
  },
];

export function LatestEvents({ locale }: LatestEventsProps) {
  const t = useTranslations('LatestEvents');
  const isRtl = locale === 'ar';

  return (
    <section
      className={[
        'w-full bg-page-bg',
        'flex flex-col justify-center items-center',
        'px-6 sm:px-12 lg:px-[160px]',
        'py-10',
        'gap-[22px]',
      ].join(' ')}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Title */}
      <div
        className={isRtl ? 'font-arabic' : 'font-helvetica'}
        style={{
          textAlign: 'center',
          color: 'white',
          fontSize: 48,
          fontWeight: 400,
          lineHeight: '72px',
          wordWrap: 'break-word',
        }}
      >
        {t('title')}
      </div>

      {/* Cards row */}
      <div
        className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-6"
      >
        {EVENTS.map((event) => (
          <div
            key={event.id}
            style={{
              flex: '1 1 0',
              paddingBottom: 16,
              position: 'relative',
              background: '#1A1A1A',
              boxShadow: '0px 0px 23px rgba(0,0,0,0.08)',
              borderRadius: 18,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 12,
              display: 'inline-flex',
            }}
          >
            {/* Image with gradient overlay — matches Figma img structure */}
            <div
              style={{
                alignSelf: 'stretch',
                height: 240,
                borderRadius: 13,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/events/event-bg.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
                loading="lazy"
              />
              {/* Gradient overlay matching Figma */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(26,26,26,0) 0%, #1A1A1A 100%)',
                }}
              />
            </div>

            {/* Body: tag + title */}
            <div
              style={{
                alignSelf: 'stretch',
                paddingLeft: 12,
                paddingRight: 12,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 10,
                display: 'flex',
              }}
            >
              {/* Tag pill */}
              <div
                style={{
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  background: 'rgba(255,255,255,0.10)',
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  display: 'inline-flex',
                }}
              >
                <span
                  className={isRtl ? 'font-arabic' : 'font-helvetica'}
                  style={{
                    color: '#EB0028',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '18px',
                    letterSpacing: 0.40,
                    wordWrap: 'break-word',
                  }}
                >
                  {isRtl ? event.tagAr : event.tagEn}
                </span>
              </div>

              {/* Event title */}
              <div
                style={{
                  alignSelf: 'stretch',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
              >
                <span
                  className={isRtl ? 'font-arabic' : 'font-helvetica'}
                  style={{
                    flex: '1 1 0',
                    color: '#F1F1F1',
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: '24px',
                    letterSpacing: 0.15,
                    wordWrap: 'break-word',
                  }}
                >
                  {isRtl ? event.titleAr : event.titleEn}
                </span>
              </div>
            </div>

            {/* Absolute date + time overlay (left: 12.17, top: 164 per Figma) */}
            <div
              style={{
                left: 12.17,
                top: 164,
                position: 'absolute',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'flex',
              }}
            >
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px white',
                  paintOrder: 'stroke fill',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: 34,
                  fontWeight: 500,
                  lineHeight: '41.99px',
                  letterSpacing: 0.25,
                  wordWrap: 'break-word',
                }}
              >
                {isRtl ? event.dateAr : event.date}
              </span>

              {/* Calendar icon + time */}
              <div
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 3,
                  display: 'inline-flex',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/events/calendar.png"
                  alt=""
                  style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }}
                  draggable={false}
                />
                <span
                  className={isRtl ? 'font-arabic' : 'font-helvetica'}
                  style={{
                    color: '#A8A8A8',
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: '20.02px',
                    letterSpacing: 0.17,
                    wordWrap: 'break-word',
                  }}
                >
                  {isRtl ? event.timeAr : event.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All button */}
      <Link
        href={`/${locale}/events`}
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 16,
          background: '#EB0028',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          textDecoration: 'none',
        }}
      >
        <span
          className={isRtl ? 'font-arabic' : 'font-helvetica'}
          style={{
            textAlign: 'center',
            color: '#1A1A1A',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: 0.15,
            wordWrap: 'break-word',
          }}
        >
          {t('seeAll')}
        </span>
      </Link>
    </section>
  );
}
