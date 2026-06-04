'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CircularText } from './CircularText';
import { SplitText } from './SplitText';
import { Navbar } from '../../layout/Navbar';

// 5 columns — exact Figma positions (node 84-9336)
// Each column: 243px wide, 50px overlap (mr-[-50px] in Figma flex layout)
// topOffset: image top within 700px column | leftOffset: image left within column
// 2nd and 4th cards raised from 75→38 so they sit higher in the viewport
const COLUMNS = [
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 1', topOffset: 21, leftOffset:  0 },
  { src: '/images/hero/slides/img2.png', alt: 'TEDxDamascus — moment 2', topOffset: 38, leftOffset: -9 },
  { src: '/images/hero/slides/img3.png', alt: 'TEDxDamascus — moment 3', topOffset:  0, leftOffset: -2 },
  { src: '/images/hero/slides/img4.png', alt: 'TEDxDamascus — moment 4', topOffset: 38, leftOffset: -9 },
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 5', topOffset:  0, leftOffset:  0 },
] as const;

const CIRCULAR_TEXT = 'Damascus where the story is told again ...  ·  ';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t     = useTranslations('HomePage');
  const isRtl = locale === 'ar';

  return (
    <section
      className="relative w-full overflow-hidden h-[100svh] min-h-[600px] max-h-[700px] sm:max-h-none sm:min-h-[716px] bg-[#101010]"
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

      {/* Gradient overlay */}
      <div
        className={[
          'absolute top-0 h-[716px] pointer-events-none mix-blend-overlay z-[1] w-[1475px]',
          isRtl
            ? 'left-auto -right-[19px] bg-[image:var(--hero-gradient-rtl)]'
            : 'right-auto -left-[19px] bg-[image:var(--hero-gradient)]',
        ].join(' ')}
        aria-hidden
      />

      {/* ── Image columns (sm+) ─────────────────────────────────────────────────
       * Matches Figma node 84-9336 exactly:
       * 5 columns, each 243px wide, flex row with mr-[-50px] overlap.
       * LTR: left 617px / 43% of 1440px canvas
       * RTL: mirrored via right: 43%
       */}
      <div
        className={[
          'hidden sm:block absolute z-[2] overflow-hidden',
          isRtl
            ? 'sm:right-[38%] lg:right-[42%] xl:right-[47%]'
            : 'sm:left-[38%] lg:left-[42%] xl:left-[47%]',
        ].join(' ')}
        style={{ top: 91, height: 700 }}
        aria-hidden
      >
        {/* Direction flips the visual order for RTL: img1 appears at the right edge */}
        <div
          className="flex items-start h-full"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {COLUMNS.map((col, i) => {
            const notLast = i < COLUMNS.length - 1;
            return (
            <div
              key={i}
              className="relative shrink-0 h-full"
              style={{
                width: 'clamp(180px, 16.9vw, 243px)',
                // RTL: overlap pulls toward the left (trailing side); LTR: toward right (trailing side)
                ...(isRtl
                  ? { marginLeft: notLast ? -50 : 0 }
                  : { marginRight: notLast ? -50 : 0 }),
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
            </div>
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
        {/* "WE ARE" / "نحن" — full container width */}
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

        {/* TEDx logo — Figma shows left:0 in BOTH LTR and RTL */}
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
       * Figma node 126-4567: text at top + 4 staggered parallelogram image strips
       */}
      <div className="sm:hidden absolute inset-0 z-[10] flex flex-col bg-[#101010]" style={{ paddingTop: 76 }}>
        {/* Mobile text */}
        <div className="px-6 pb-8 shrink-0">
          <h1 className="font-helvetica select-none">
            <span
              className="block text-[36px] font-light leading-[1.15] text-white"
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
                priority
              />
              <span className="text-[36px] font-light text-white leading-[1.15]">Damascus</span>
            </span>
          </h1>
        </div>

        {/* Mobile image strips — Figma: 4×96px cards, 8px gap, staggered offsets */}
        <div
          className="flex shrink-0 w-full"
          style={{ height: 384, gap: 6, background: '#101010', overflow: 'hidden' }}
        >
          {([
            { src: '/images/hero/slides/img1.png', offset: 0   },
            { src: '/images/hero/slides/img2.png', offset: 32  },
            { src: '/images/hero/slides/img3.png', offset: -16 },
            { src: '/images/hero/slides/img4.png', offset: 48  },
          ] as const).map((col, i) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden"
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
            </div>
          ))}
        </div>
      </div>

      {/* ── Circular scroll badge ────────────────────────────────────────────────
       * Figma shows left:540 in BOTH LTR and RTL — not mirrored.
       * 540/1440 = 37.5% keeps it proportional on different viewport widths.
       */}
      <div
        className="absolute z-20 hidden sm:block"
        style={{ left: '37.5%', top: 592, width: 174, height: 174 }}
      >
        <CircularText
          text={CIRCULAR_TEXT}
          spinDuration={20}
          onHover="slowDown"
          className="w-full h-full"
        />

        {/* Scroll icon — Figma: left:63.13, top:59.13 within the ring */}
        <div className="absolute w-12 h-14" style={{ left: 63, top: 59 }}>
          <div className="absolute w-[16.59px] h-[25.71px] left-4 top-[10px] outline outline-[2.68px] outline-white [outline-offset:-1.34px] rounded-[8px]" />
          <div className="animate-scroll-wheel absolute w-[2.14px] h-[5.36px] left-[23.23px] top-[14.29px] bg-white rounded-[1px]" />
        </div>
      </div>
    </section>
  );
}
