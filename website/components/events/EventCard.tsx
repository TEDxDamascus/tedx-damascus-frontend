'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api/client';

const CALENDAR_SRC = '/images/events/calendar-03.svg';

export type EventCardProps = {
    title: string;
    dateLabel: string;
    timeLabel: string;
    badge: string;
    isRtl: boolean;
    href?: string;
    bio?: string;
    image?: string;
};

export function EventCard({ title, dateLabel, timeLabel, badge, bio, isRtl, href, image }: EventCardProps) {
    const card = (
        <article
            className="flex w-full flex-col overflow-hidden rounded-2xl  "
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* Hero image: wide landscape, top corners match card; bottom edge straight into body */}
            {/* Make the image tile have a sharp bottom edge (no visible card border) and reduce overlay haze */}
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-2xl bg-black">
                <Image
                    src={getImageUrl(image)}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
                    priority={false}
                />
                {/* Bottom fade so date / busy stage stay readable (matches reference photo treatment) */}
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[60%] bg-gradient-to-t from-[#101010]/80 to-transparent"
                    aria-hidden
                />
                <div
                    className={[
                        'absolute bottom-3 start-5 z-[2] max-w-[90%] sm:bottom-4',
                        isRtl ? 'text-right' : 'text-left',
                    ].join(' ')}
                >
                    <p
                        className={[
                            'text-start font-normal tracking-tight',
                            // تغيير الخط وتكبير الحجم وتغيير اللون إلى شفاف
                            'font-helvetica text-[38px] leading-[1.235] text-transparent',
                            // إضافة حواف بيضاء بعرض 1.5px أو 2px حسب الرغبة
                            '[-webkit-text-stroke:1px_#ffffff] [paint-order:stroke_fill]',
                            // الظل الخفيف تحت النص إذا كنت تحتاجه
                            '[text-shadow:0_4px_4px_rgba(0,0,0,0.15)]',
                            isRtl ? 'font-arabic' : '',
                        ].join(' ')}
                    >
                        {dateLabel}
                    </p>

                    <div className={`flex items-center gap-2 text-sm font-normal text-[#A8A8A8] ${isRtl ? 'flex-row-reverse' : ''}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={CALENDAR_SRC}
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5 shrink-0 opacity-50 brightness-0 invert"
                            draggable={false}
                        />
                        <span className={isRtl ? 'font-arabic ' : 'font-sans'}>{timeLabel}</span>
                    </div>
                </div>
            </div>

            {/* Body: ~20px padding;  tag → title */}
            <div className="flex flex-col gap-3 p-3.5">
                <p
                    className={[
                        '  px-0.5 py-0.5 text-lg font-bold text-[#EB0028]',
                        isRtl ? 'font-arabic' : 'font-sans',
                    ].join(' ')}
                >
                    {badge}
                </p>

                <h2
                    className={[
                        'mt-0.5 text-md font-normal text-[#A8A8A8] ',
                        isRtl ? 'font-arabic text-start' : 'font-helvetica text-start',
                    ].join(' ')}
                >
                    {title}
                </h2>

                {bio && (
                    <p
                        className={[
                            'text-sm leading-[1.5] text-[#7a7a7a] line-clamp-2',
                            isRtl ? 'font-arabic text-start' : 'font-sans text-start',
                        ].join(' ')}
                    >
                        {bio}
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