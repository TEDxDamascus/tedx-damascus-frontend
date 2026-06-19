'use client';

import Image from 'next/image';

const CALENDAR_SRC = '/images/events/calendar-03.svg';
const EVENT_IMAGE_SRC = '/images/events/event-card.png';

export type EventCardProps = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  badge: string;
  isRtl: boolean;
};

export function EventCard({ title, dateLabel, timeLabel, badge, isRtl }: EventCardProps) {
  return (
    <article
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-[#121212] shadow-lg shadow-black/30"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Hero image: wide landscape, top corners match card; bottom edge straight into body */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-2xl">
        <Image
          src={EVENT_IMAGE_SRC}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
          priority={false}
        />
        {/* Bottom fade so date / busy stage stay readable (matches reference photo treatment) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[60%] bg-gradient-to-t from-black via-black/75 to-transparent"
          aria-hidden
        />
        <p
          className={[
            'absolute bottom-3 start-5 z-[2] max-w-[90%] text-start font-normal tracking-tight sm:bottom-4',
            'font-helvetica text-[34px] leading-[1.235] text-[rgba(20,20,20,0.82)]',
            '[-webkit-text-stroke:1px_#d1d1d1] [paint-order:stroke_fill]',
            isRtl ? 'font-arabic' : '',
          ].join(' ')}
        >
          {dateLabel}
        </p>
      </div>

      {/* Body: ~20px padding; time → tag → title */}
      <div className="flex flex-col gap-3 p-5">
        <div
          className={`flex items-center gap-2 text-sm font-normal text-secondary-200 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CALENDAR_SRC}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 opacity-90 brightness-0 invert"
            draggable={false}
          />
          <span className={isRtl ? 'font-arabic' : 'font-sans'}>{timeLabel}</span>
        </div>

        <p
          className={[
            'inline-flex w-fit max-w-full rounded-full bg-neutral-300 px-4 py-1 text-sm font-medium text-primary-dark',
            isRtl ? 'font-arabic' : 'font-sans',
          ].join(' ')}
        >
          {badge}
        </p>

        <h2
          className={[
            'mt-4 text-lg font-bold leading-snug text-white sm:leading-snug',
            isRtl ? 'font-arabic text-start' : 'font-helvetica text-start',
          ].join(' ')}
        >
          {title}
        </h2>
      </div>
    </article>
  );
}
