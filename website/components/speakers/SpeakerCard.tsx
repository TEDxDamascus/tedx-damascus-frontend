'use client';

import Image from 'next/image';
import Link from 'next/link';

const SPEAKER_PLACEHOLDER = '/images/speakers/Background.png';

export type SpeakerCardProps = {
  name: string;
  role: string;
  eventName: string;
  imageUrl?: string;
  isRtl: boolean;
  href?: string;
};

export function SpeakerCard({ name, role, imageUrl, isRtl, href }: SpeakerCardProps) {
  const inner = (
    <article
      className="group flex w-full flex-col overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Portrait photo */}
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#1a1a1a]">
        <Image
          src={imageUrl || SPEAKER_PLACEHOLDER}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
        />
      </div>

      {/* Red info bar */}
      <div
        className={[
          'flex w-full flex-col gap-1 bg-primary/60 px-4 py-3',
          isRtl ? 'items-end text-end' : 'items-start text-start',
        ].join(' ')}
      >
        <h2
          className={[
            'text-[13px] font-bold uppercase leading-tight tracking-wider text-white',
            isRtl ? 'font-arabic' : 'font-helvetica',
          ].join(' ')}
        >
          {name}
        </h2>
        <p
          className={[
            'line-clamp-1 text-[11px] font-normal leading-snug text-white/80',
            isRtl ? 'font-arabic' : 'font-sans',
          ].join(' ')}
        >
          {role}
        </p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block cursor-pointer">
        {inner}
      </Link>
    );
  }

  return inner;
}
