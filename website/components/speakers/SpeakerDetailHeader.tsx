'use client';

import Image from 'next/image';
import Link from 'next/link';

const SPEAKER_PLACEHOLDER = '/images/speakers/Background.png';
const PATTERN_SRC = '/images/about/pattern.svg';

export interface SpeakerDetailHeaderProps {
  name: string;
  bio: string;
  description: string;
  imageUrl?: string;
  linkedinUrl?: string;
  emailUrl?: string;
  isRtl: boolean;
}

export function SpeakerDetailHeader({
  name,
  bio,
  description,
  imageUrl,
  linkedinUrl,
  emailUrl,
  isRtl,
}: SpeakerDetailHeaderProps) {
  return (
    <section
      className="relative overflow-hidden bg-black"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Background pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {/* Pattern tile — subtle opacity */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PATTERN_SRC}
          alt=""
          className={[
            'absolute inset-0 h-full w-full select-none object-cover object-top opacity-60',
            isRtl ? 'scale-x-[-1]' : '',
          ].join(' ')}
          draggable={false}
        />
        {/* Left-side gradient: hides pattern behind photo area */}
        <div
          className={[
            'absolute inset-y-0 w-[65%] to-transparent',
            isRtl
              ? 'right-0 bg-gradient-to-l from-black via-black/95'
              : 'left-0 bg-gradient-to-r from-black via-black/95',
          ].join(' ')}
        />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-[1180px] px-[clamp(1rem,5vw,4rem)] pb-8 pt-32 sm:pb-10 sm:pt-36 lg:pt-40">
        <div
          className={[
            'flex flex-col items-center gap-10',
            'sm:flex-row sm:items-center sm:gap-12 lg:gap-16',
          ].join(' ')}
        >

          {/* ── Photo with decorative SVG shapes behind it ── */}
          <div className="relative shrink-0 w-[240px] sm:w-[280px] lg:w-[340px]">

            {/* Triangle — top-right, behind the photo */}
            <div
              aria-hidden
              className={[
                'pointer-events-none absolute z-0 w-[100px] h-[104px]',
                isRtl
                  ? '-left-[45px] -top-[50px]'
                  : '-right-[45px] -top-[50px]',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/add-your-line/triangle.svg" alt="" className="w-full h-full" draggable={false} />
            </div>

            {/* Rectangle — bottom-left, behind the photo */}
            <div
              aria-hidden
              className={[
                'pointer-events-none absolute z-0 w-[160px] h-[155px]',
                isRtl
                  ? '-right-[60px] -bottom-[55px]'
                  : '-left-[60px] -bottom-[55px]',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/add-your-line/rectangle.svg" alt="" className="w-full h-full" draggable={false} />
            </div>

            {/* Photo — z-[1] so it sits on top of the shapes */}
            <div className="relative z-[1] aspect-[3/4] w-full overflow-hidden">
              <Image
                src={imageUrl || SPEAKER_PLACEHOLDER}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 340px"
                priority
              />
            </div>
          </div>

          {/* ── Text content ── */}
          <div
            className={[
              'flex flex-col flex-1',
              isRtl ? 'items-end text-end gap-4' : 'items-start text-start gap-4',
            ].join(' ')}
          >
            {/* Name — large, red, Figma style */}
            <h1
              className={[
                'text-primary font-bold leading-tight',
                'text-4xl sm:text-5xl lg:text-[54px]',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              {name}
            </h1>

            {/* Bio / roles — bold, white */}
            {bio && (
              <p
                className={[
                  'text-white font-bold text-base sm:text-lg leading-relaxed',
                  isRtl ? 'font-arabic' : 'font-helvetica',
                ].join(' ')}
              >
                {bio}
              </p>
            )}

            {/* Description / quote — muted white with red quotes */}
            {description && (
              <p
                className={[
                  'text-white/70 font-normal text-sm sm:text-base leading-relaxed max-w-[500px]',
                  isRtl ? 'font-arabic' : 'font-sans',
                ].join(' ')}
              >
                <span className="text-primary font-bold">"</span>
                {description.replace(/^[""]|[""]$/g, '')}
                <span className="text-primary font-bold">"</span>
              </p>
            )}

            {/* Social links */}
            {(emailUrl || linkedinUrl) && (
              <div
                className={[
                  'flex flex-col gap-2.5 mt-2',
                  isRtl ? 'items-end' : 'items-start',
                ].join(' ')}
              >
                {emailUrl && (
                  <Link
                    href={emailUrl.startsWith('mailto:') ? emailUrl : `mailto:${emailUrl}`}
                    className={[
                      'flex items-center gap-2.5 text-white/60 text-sm hover:text-white transition-colors',
                      isRtl ? 'flex-row-reverse' : '',
                    ].join(' ')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/speakers/email.svg"
                      alt=""
                      width={15}
                      height={12}
                      className="shrink-0"
                      draggable={false}
                    />
                    <span className={isRtl ? 'font-arabic' : 'font-sans'}>
                      {emailUrl.replace('mailto:', '')}
                    </span>
                  </Link>
                )}

                {linkedinUrl && (
                  <Link
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      'flex items-center gap-2.5 text-white/60 text-sm hover:text-white transition-colors',
                      isRtl ? 'flex-row-reverse' : '',
                    ].join(' ')}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/speakers/linked-in.svg"
                      alt=""
                      width={15}
                      height={10}
                      className="shrink-0"
                      draggable={false}
                    />
                    <span className={isRtl ? 'font-arabic' : 'font-sans'}>
                      {linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
