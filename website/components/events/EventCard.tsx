'use client';

import Image from 'next/image';
import Link from 'next/link';

const EVENT_IMAGE_SRC = '/images/events/event-card.png';

export type EventCardProps = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  badge: string;
  bio?: string;
  isRtl: boolean;
  href?: string;
};

export function EventCard({ title, dateLabel, timeLabel, badge, bio, isRtl, href }: EventCardProps) {
  const card = (
    <article
      className="flex w-full flex-col overflow-hidden rounded-2xl shadow-lg shadow-black/30"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Hero image with title + date overlay */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-2xl bg-transparent">
        <Image
          src={EVENT_IMAGE_SRC}
          alt={title}
          fill
          className="object-contain object-center p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
          priority={false}
        />
        {/* top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[35%] bg-gradient-to-b from-black/50 to-transparent" aria-hidden />
        {/* bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[60%] bg-gradient-to-t from-black/95 via-black/50 to-transparent" aria-hidden />
        {/* side fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[20%] bg-gradient-to-r from-black/40 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[20%] bg-gradient-to-l from-black/40 to-transparent" aria-hidden />
        {/* Title + date on image — title left, date right, no truncation */}
        <div className={['absolute bottom-3 z-[2] px-4 w-full flex items-end gap-3', isRtl ? 'flex-row-reverse' : ''].join(' ')}>
          <p className={['text-white text-[15px] font-bold leading-snug flex-1', isRtl ? 'font-arabic text-right' : 'font-helvetica text-left'].join(' ')}>
            {title}
          </p>
          <p className="text-white/60 text-[13px] font-normal font-helvetica shrink-0 pb-[2px]">
            {dateLabel}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-5">
        {(bio || timeLabel) && (
          <p
            className={[
              'text-[#a8a8a8] text-[13px] leading-[1.5] line-clamp-2',
              isRtl ? 'font-arabic text-right' : 'font-helvetica text-left',
            ].join(' ')}
          >
            {bio || timeLabel}
          </p>
        )}
        {badge && (
          <p
            className={[
              'inline-flex w-fit max-w-full rounded-full bg-neutral-300 px-4 py-1 text-sm font-medium text-primary-dark',
              isRtl ? 'font-arabic' : 'font-sans',
            ].join(' ')}
          >
            {badge}
          </p>
        )}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {card}
      </Link>
    );
  }
  return card;
}
