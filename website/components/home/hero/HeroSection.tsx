'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CircularText } from './CircularText';
import { SplitText } from './SplitText';
import { Navbar } from '../../layout/Navbar';

// 5 columns — stagger top offsets match Figma (21 / 75 / 0 / 75 / 0)
const COLUMNS = [
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 1', topOffset: 21 },
  { src: '/images/hero/slides/img2.png', alt: 'TEDxDamascus — moment 2', topOffset: 75 },
  { src: '/images/hero/slides/img3.png', alt: 'TEDxDamascus — moment 3', topOffset: 0  },
  { src: '/images/hero/slides/img4.png', alt: 'TEDxDamascus — moment 4', topOffset: 75 },
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 5', topOffset: 0  },
] as const;

// 243px col − 50px overlap = 193px step
const COL_OFFSET = 193;

const CIRCULAR_TEXT = 'Damascus where the story is told again ...  ·  ';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t     = useTranslations('HomePage');
  const isRtl = locale === 'ar';

  return (
    <section
      className="relative w-full overflow-hidden h-[100svh] min-h-[716px] bg-[#101010]"
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

      {/* ── Image columns ────────────────────────────────────────────────────────
       * LTR: left ~43% ≈ 617px on 1440px canvas
       * RTL: right ~43% → container left edge ≈ −176px (matches Figma)
       * Percentage keeps it proportional across viewport widths.
       */}
      <div
        className="hidden lg:block absolute z-[2] overflow-hidden top-[91px]"
        style={{
          [isRtl ? 'right' : 'left']: '43%',
          width: 1008,
          height: 700,
        }}
        aria-hidden
      >
        <div className="relative w-full h-full">
          {COLUMNS.map((col, i) => (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{
                width: 243,
                [isRtl ? 'right' : 'left']: i * COL_OFFSET,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={col.src}
                alt={col.alt}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                loading="eager"
                style={{ position: 'absolute', top: col.topOffset, left: 0, width: 243, height: 625.5 }}
                className="object-cover [filter:var(--hero-slide-filter)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero text block ──────────────────────────────────────────────────────
       * LTR: left 5% ≈ 72px, top 378  (Figma LTR: left 72, top 378)
       * RTL: right 5% ≈ 72px, top 365 (Figma RTL: left 892 → right ≈ 71px, top 364.5)
       */}
      <div
        className="absolute z-[10]"
        style={{
          [isRtl ? 'right' : 'left']: '5%',
          top: isRtl ? 365 : 378,
          width: 477,
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
            splitType="chars"
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

        {/* "Damascus" — Figma shows left:183.31 in BOTH LTR and RTL */}
        <span
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

      {/* ── Circular scroll badge ────────────────────────────────────────────────
       * Figma shows left:540 in BOTH LTR and RTL — not mirrored.
       * 540/1440 = 37.5% keeps it proportional on different viewport widths.
       */}
      <div
        className="absolute z-20"
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
