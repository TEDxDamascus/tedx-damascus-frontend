'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CircularText } from './CircularText';
import { SplitText } from './SplitText';
import { Navbar } from '../../layout/Navbar';

// 5 columns — exact Figma positions (node 84-9336)
// Each column: 243px wide, 50px overlap (mr-[-50px] in Figma flex layout)
// topOffset: image top within 700px column | leftOffset: image left within column
const COLUMNS = [
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 1', topOffset: 21, leftOffset:  0 },
  { src: '/images/hero/slides/img2.png', alt: 'TEDxDamascus — moment 2', topOffset: 38, leftOffset: -9 },
  { src: '/images/hero/slides/img3.png', alt: 'TEDxDamascus — moment 3', topOffset:  0, leftOffset: -2 },
  { src: '/images/hero/slides/img4.png', alt: 'TEDxDamascus — moment 4', topOffset: 38, leftOffset: -9 },
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 5', topOffset:  0, leftOffset:  0 },
] as const;

// Mobile strips — 4 parallelogram image strips
const MOBILE_STRIPS = [
  { src: '/images/hero/slides/img1.png', offset: 0   },
  { src: '/images/hero/slides/img2.png', offset: 32  },
  { src: '/images/hero/slides/img3.png', offset: -16 },
  { src: '/images/hero/slides/img4.png', offset: 48  },
] as const;

const CIRCULAR_TEXT_EN = 'Damascus where the story is told anew ...  ·  ';
// Arabic text is repeated so it fills the circle without needing textLength (which breaks letter joining)
const CIRCULAR_TEXT_AR = 'دمشق حيث تُروى الحكاية من جديد ...  ·  دمشق حيث تُروى الحكاية من جديد ...  ·  ';

// Figma animation: columns 1 & 3 slide in from top, 2 & 4 from bottom
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // easeOutQuint

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t     = useTranslations('HomePage');
  const isRtl = locale === 'ar';

  return (
    <section
      className="relative w-full overflow-hidden h-[100svh] min-h-[600px] max-h-[700px] sm:max-h-none sm:min-h-[800px] bg-[#101010]"
      aria-label={t('title')}
    >
      <Navbar locale={locale} />

      {/* Background dot pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/pattern.svg"
          alt=""
          fetchPriority="high"
          loading="eager"
          className={[
            'absolute top-0 h-[716px] w-[1680px]',
            isRtl ? '-right-[50px] left-auto scale-x-[-1]' : '-left-[50px] right-auto',
          ].join(' ')}
        />
      </div>

      {/* Far-edge fade — softens whichever viewport edge the image columns bleed off-screen toward */}
      <div
        className={[
          'absolute inset-y-0 pointer-events-none z-[3] w-16',
          isRtl ? 'left-0 bg-gradient-to-r from-[#101010] to-transparent' : 'right-0 bg-gradient-to-l from-[#101010] to-transparent',
        ].join(' ')}
        aria-hidden
      />

      {/* ── Image columns (sm+) ─────────────────────────────────────────────────
       * Figma animation: odd indices (0,2,4) slide in from top, even (1,3) from bottom.
       * Container overflow-hidden clips the off-screen start positions.
       */}
      <div
        className={[
          'hidden sm:block absolute z-[2] overflow-hidden',
          isRtl
            ? 'sm:right-[38%] lg:right-[42%] xl:right-[47%]'
            : 'sm:left-[38%] lg:left-[42%] xl:left-[47%]',
        ].join(' ')}
        style={{ top: 80, height: 711 }}
        aria-hidden
      >
        {/* Left-edge fade: gradient from the card side */}
        <div
          className={[
            'absolute top-0 h-full w-12 z-[3] pointer-events-none',
            isRtl
              ? 'right-0 bg-gradient-to-l from-[#101010] to-transparent'
              : 'left-0 bg-gradient-to-r from-[#101010] to-transparent',
          ].join(' ')}
        />
        {/* Right-edge fade */}
        <div
          className={[
            'absolute top-0 h-full w-32 z-[3] pointer-events-none',
            isRtl
              ? 'left-0 bg-gradient-to-r from-[#101010] to-transparent'
              : 'right-0 bg-gradient-to-l from-[#101010] to-transparent',
          ].join(' ')}
        />
        {/* Top-edge fade: covers navbar area so columns blend into background */}
        <div className="absolute top-0 left-0 right-0 h-40 z-[3] pointer-events-none bg-gradient-to-b from-[#101010] via-[#101010]/60 to-transparent" />
        <div
          className="flex items-start h-full"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {COLUMNS.map((col, i) => {
            const notLast = i < COLUMNS.length - 1;
            const fromTop = i % 2 === 0; // 1st, 3rd, 5th from top; 2nd, 4th from bottom
            return (
              <motion.div
                key={i}
                className="relative shrink-0 h-full"
                initial={{ y: fromTop ? -700 : 700 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.8,
                  ease: SLIDE_EASE,
                  delay: 0.15 + i * 0.1,
                }}
                style={{
                  width: 'clamp(180px, 16.9vw, 243px)',
                  ...(isRtl
                    ? { marginLeft: notLast ? -20 : 0 }
                    : { marginRight: notLast ? -20 : 0 }),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.src}
                  alt={col.alt}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading="eager"
                  className="absolute object-cover [filter:var(--hero-slide-filter)]"
                  style={{
                    top: col.topOffset,
                    left: col.leftOffset,
                    width: 'clamp(180px, 16.9vw, 243px)',
                    height: 625.5,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Hero text block (sm+) ──────────────────────────────────────────────── */}
      <div
        className="hidden sm:block absolute z-[10] w-[90vw] sm:w-[477px] sm:top-[220px] md:top-[270px] lg:top-[300px] xl:top-[378px]"
        style={{
          [isRtl ? 'right' : 'left']: '5%',
          height: 153,
        }}
      >
        {/* "WE ARE" / "نحن" */}
        <h1
          className={[
            'absolute top-0 left-0 w-full font-helvetica font-light leading-[72px] select-none',
            'text-[60px] tracking-[0] text-secondary',
            isRtl ? 'text-center' : 'text-left',
          ].join(' ')}
        >
          <SplitText
            text={t('heroWeAre')}
            tag="span"
            textAlign={isRtl ? 'center' : 'left'}
            delay={45}
            duration={1.0}
            ease="power3.out"
            splitType={isRtl ? 'words' : 'chars'}
            from={{ opacity: 0, y: 32 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-80px"
          />
        </h1>

        {/* TEDx logo */}
        <div className="absolute" style={{ left: 0, top: 77.48 }}>
          <Image
            src="/images/hero/tedx-hero.png"
            alt="TEDx"
            width={168}
            height={47}
            className="object-contain shrink-0"
            priority
          />
        </div>

        {/* "Damascus" — always LTR so SplitText chars stay left-to-right in RTL pages */}
        <span
          dir="ltr"
          className="absolute font-helvetica font-light leading-none select-none text-[60px] tracking-[0] text-secondary"
          style={{ left: 183.31, top: 77.89 }}
        >
          <SplitText
            text="Damascus"
            tag="span"
            textAlign="left"
            delay={45}
            duration={1.0}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 32 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-80px"
          />
        </span>
      </div>

      {/* ── Mobile hero layout (< sm) ───────────────────────────────────────────
       * Full-height flex column: text at top + 4 animated parallelogram strips below.
       * Strips use flex-1 so they fill whatever space remains after the text block,
       * adapting to any phone height without overflow.
       */}
      <div
        className="sm:hidden absolute inset-0 z-[10] flex flex-col"
        style={{ paddingTop: 76, background: '#101010' }}
      >
        {/* Pattern at the top — matches events/wall page mobile style */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/pattern.svg"
            alt=""
            className={['block h-[320px] w-full select-none object-cover object-top', isRtl ? 'scale-x-[-1]' : ''].join(' ')}
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#101010] to-transparent" />
        </div>
        {/* Gradient behind navbar so text stays readable over the pattern */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
          style={{ zIndex: 5, background: 'linear-gradient(to bottom, #101010 0%, transparent 100%)' }}
        />
        {/* Mobile text */}
        <div className="relative px-6 pb-4 shrink-0">
          <h1 className="font-helvetica select-none">
            <span
              className="block text-[clamp(26px,9vw,36px)] font-light leading-[1.15] text-white"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {isRtl ? 'نحن' : 'WE ARE'}
            </span>
            <span className="flex items-end gap-2" dir="ltr">
              <Image
                src="/images/hero/tedx-hero.png"
                alt="TEDx"
                width={110}
                height={31}
                className="object-contain mb-[2px]"
                style={{ width: 'clamp(80px, 28vw, 110px)', height: 'auto' }}
                priority
              />
              <span className="text-[clamp(26px,9vw,36px)] font-light text-white leading-[1.15]">Damascus</span>
            </span>
          </h1>
        </div>

        {/* Mobile image strips */}
        <div
          className="relative flex flex-1 min-h-0 w-full max-h-[440px]"
          style={{ gap: 6, overflow: 'hidden' }}
        >
          {/* Top fade — blends strips into text area above */}
          <div className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none bg-gradient-to-b from-[#101010] to-transparent" />
          {/* Bottom fade — blends strips into section below */}
          <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none bg-gradient-to-t from-[#101010] to-transparent" />

          {MOBILE_STRIPS.map((col, i) => {
            const fromTop = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className="relative flex-1 overflow-hidden"
                initial={{ y: fromTop ? -400 : 400 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.6,
                  ease: SLIDE_EASE,
                  delay: 0.2 + i * 0.1,
                }}
                style={{ clipPath: 'polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.src}
                  alt=""
                  loading="eager"
                  className="absolute left-0 w-full object-cover [filter:var(--hero-slide-filter)]"
                  style={{ top: col.offset, height: 'calc(100% + 64px)' }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Circular scroll badge — sits at the graphic/image junction ── */}
      <div
        className={[
          'absolute z-20 hidden sm:block -translate-x-1/2',
          isRtl
            ? 'sm:left-[62%] lg:left-[58%] xl:left-[53%]'
            : 'sm:left-[38%] lg:left-[42%] xl:left-[47%]',
        ].join(' ')}
        style={{ top: 630, width: 174, height: 174 }}
      >
        <CircularText
          text={isRtl ? CIRCULAR_TEXT_AR : CIRCULAR_TEXT_EN}
          spinDuration={20}
          onHover="slowDown"
          className="w-full h-full"
        />

        {/* Scroll icon — centered with CSS transforms, not hardcoded pixels */}
        <div className="absolute w-12 h-14 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-[16.59px] h-[25.71px] left-4 top-[15px] outline outline-[2.68px] outline-white [outline-offset:-1.34px] rounded-[8px]" />
          <div className="animate-scroll-wheel absolute w-[2.14px] h-[5.36px] left-[23.23px] top-[19px] bg-white rounded-[1px]" />
        </div>
      </div>
    </section>
  );
}
