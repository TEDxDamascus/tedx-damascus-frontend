import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlurText } from './BlurText';

interface CallForVoicesProps {
  locale: string;
}

function CardShapes() {
  return (
    <>
      <div
        className="absolute pointer-events-none left-[357.99px] -top-[3.24px] w-[99.57px] h-[103.97px]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/add-your-line/triangle.svg" alt="" className="w-full h-full" draggable={false} loading="lazy" />
      </div>
      <div
        className="absolute pointer-events-none -left-[5.28px] top-[88.63px] w-[204.73px] h-[198.03px]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/add-your-line/rectangle.svg" alt="" className="w-full h-full" draggable={false} loading="lazy" />
      </div>
    </>
  );
}

function VoiceCard({ ghostIcon, isRtl, children }: { ghostIcon: string; isRtl: boolean; children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[498.6px] mx-auto sm:h-[311.96px] lg:flex-1 lg:max-w-none lg:mx-0">
      {/* Decorative shapes only at sm+ where container has full pixel width */}
      <div className="hidden sm:block"><CardShapes /></div>

      {/*
        Mobile: normal flow block, horizontally centered
        sm+: absolute positioned per Figma spec
      */}
      <div
        className={[
          'bg-card-bg overflow-hidden flex flex-col justify-between items-start',
          'shadow-[1.724px_1.724px_4.311px_0.862px_rgba(0,0,0,0.50)]',
          'px-6 py-6 w-full',
          // Desktop: absolute, fixed 340×200, Figma offsets
          isRtl
            ? 'sm:absolute sm:w-[340px] sm:h-[200px] sm:top-[33px] sm:right-[57px] sm:px-[42px] sm:py-[36px]'
            : 'sm:absolute sm:w-[340px] sm:h-[200px] sm:top-[33px] sm:left-[57px] sm:px-[42px] sm:py-[36px]',
        ].join(' ')}
      >
        <div
          aria-hidden
          className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-[190px] h-[190px] opacity-[0.35]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ghostIcon} alt="" className="w-full h-full" draggable={false} loading="lazy" />
        </div>
        {children}
      </div>
    </div>
  );
}

// Inline RTL-aware arrow for CTAs
function CtaArrow({ isRtl }: { isRtl: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={isRtl ? 'M10 2L4 7L10 12' : 'M4 2L10 7L4 12'}
        stroke="#EB0028"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function CallForVoices({ locale }: CallForVoicesProps) {
  setRequestLocale(locale);
  const t = await getTranslations('CallForVoices');
  const isRtl = locale === 'ar';

  const speakerFormHref = `/${locale}/forms/speakers-2026`;

  return (
    <section className="w-full px-4 sm:px-10 lg:px-[20px] xl:px-[60px] pb-[60px] overflow-hidden flex flex-col justify-center items-center bg-page-bg">

      {/* Title — centered, decorative images on sides (hidden on small screens) */}
      <div className="relative w-full flex justify-center items-center py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isRtl ? '/images/call-for-voices/group-left.png' : '/images/call-for-voices/group-right.png'}
          alt="" aria-hidden draggable={false} loading="lazy"
          className="hidden lg:block absolute left-0 w-[240px] xl:w-[320px] h-auto object-contain pointer-events-none"
        />
        <BlurText
          text={t('title')}
          delay={120}
          direction="top"
          className="text-center text-white text-[32px] sm:text-[48px] font-helvetica font-normal leading-tight sm:leading-[72px] break-words"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isRtl ? '/images/call-for-voices/group-right.png' : '/images/call-for-voices/group-left.png'}
          alt="" aria-hidden draggable={false} loading="lazy"
          className="hidden lg:block absolute right-0 w-[240px] xl:w-[320px] h-auto object-contain pointer-events-none"
        />
      </div>

      {/* Cards — side by side on sm+, stacked and centered on mobile */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-center items-center sm:items-start gap-8 lg:gap-6 w-full max-w-[1100px]">

        <VoiceCard ghostIcon="/images/call-for-voices/user.svg" isRtl={isRtl}>
          <div className="relative z-10 self-stretch flex flex-col justify-center items-start gap-8">
            <p
              className="self-stretch text-white text-2xl font-helvetica font-bold leading-[32.02px] break-words"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {t('nominateLine1')}<br />{t('nominateLine2')}
            </p>
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {isRtl && <CtaArrow isRtl />}
              <Link
                href={speakerFormHref}
                className="whitespace-nowrap text-primary text-base font-helvetica leading-6 tracking-[0.15px] hover:underline underline-offset-2 transition-all"
              >
                {t('nominateCta')}
              </Link>
              {!isRtl && <CtaArrow isRtl={false} />}
            </div>
          </div>
        </VoiceCard>

        <VoiceCard ghostIcon="/images/call-for-voices/podcast.svg" isRtl={isRtl}>
          <div className="relative z-10 self-stretch flex flex-col justify-center items-start gap-8">
            <p
              className="self-stretch text-white text-2xl font-helvetica font-bold leading-[32.02px] break-words"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {t('applyLine1')}<br />{t('applyLine2')}
            </p>
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {isRtl && <CtaArrow isRtl />}
              <Link
                href={speakerFormHref}
                className="whitespace-nowrap text-primary text-base font-helvetica leading-6 tracking-[0.15px] hover:underline underline-offset-2 transition-all"
              >
                {t('applyCta')}
              </Link>
              {!isRtl && <CtaArrow isRtl={false} />}
            </div>
          </div>
        </VoiceCard>

      </div>
    </section>
  );
}
