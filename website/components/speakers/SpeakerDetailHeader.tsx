'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PressKitShareButton } from '@/components/shared';

const SPEAKER_PLACEHOLDER = '/images/speakers/Background.png';
const PATTERN_SRC = '/images/about/pattern.svg';

export interface SpeakerDetailHeaderProps {
  name: string;
  bio: string;
  description: string;
  imageUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  isRtl: boolean;
}

function normalizeExternalUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export function SpeakerDetailHeader({
  name,
  bio,
  description,
  imageUrl,
  linkedinUrl,
  facebookUrl,
  isRtl,
}: SpeakerDetailHeaderProps) {
  const labels = {
    linkedin: isRtl ? 'لينكد إن' : 'LINKEDIN',
    facebook: isRtl ? 'فيسبوك' : 'FACEBOOK',
    share: isRtl ? 'مشاركة' : 'PRESS KIT',
  };

  const normalizedLinkedin = linkedinUrl ? normalizeExternalUrl(linkedinUrl) : undefined;
  const normalizedFacebook = facebookUrl ? normalizeExternalUrl(facebookUrl) : undefined;

  const actionClass = [
    'flex items-center gap-2.5 font-sans text-[13px] font-bold uppercase tracking-[1px]',
    'text-[#A8A8A8] transition-colors hover:text-white',
    isRtl ? 'font-arabic normal-case tracking-normal' : '',
  ].join(' ');

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
        <div
          className={[
            'absolute inset-y-0 w-[65%] to-transparent',
            isRtl
              ? 'right-0 bg-gradient-to-l from-black via-black/95'
              : 'left-0 bg-gradient-to-r from-black via-black/95',
          ].join(' ')}
        />
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
          {/* ── Photo ── */}
          <div className="relative shrink-0 w-[240px] sm:w-[280px] lg:w-[340px]">
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
            <h1
              className={[
                'text-primary font-bold leading-tight',
                'text-4xl sm:text-5xl lg:text-[54px]',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              {name}
            </h1>

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

            {description && (
              <p
                className={[
                  'text-white/70 font-normal text-sm sm:text-base leading-relaxed max-w-[500px]',
                  isRtl ? 'font-arabic' : 'font-sans',
                ].join(' ')}
              >
                <span className="text-primary font-bold">&quot;</span>
                {description.replace(/^[""]|[""]$/g, '')}
                <span className="text-primary font-bold">&quot;</span>
              </p>
            )}

            {/* LinkedIn + Share */}
            <div
              className={[
                'relative mt-10 sm:mt-12 flex flex-wrap items-center gap-10 sm:gap-12',
                isRtl ? 'justify-end' : 'justify-start',
              ].join(' ')}
            >
              {normalizedLinkedin && (
                <Link
                  href={normalizedLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/speakers/linked-in.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                    draggable={false}
                  />
                  <span>{labels.linkedin}</span>
                </Link>
              )}

              {normalizedFacebook && (
                <Link
                  href={normalizedFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/speakers/facebook.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                    draggable={false}
                  />
                  <span>{labels.facebook}</span>
                </Link>
              )}

              <PressKitShareButton
                name={name}
                isRtl={isRtl}
                label={labels.share}
                className={actionClass}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/speakers/share-button.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                  draggable={false}
                />
              </PressKitShareButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
