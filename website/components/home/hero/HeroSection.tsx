'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CircularText } from './CircularText';
import { SplitText } from './SplitText';
import { Navbar } from '../../layout/Navbar';

// 4 columns: alternating scroll direction.
// Animation plays ONCE then stays at the final frame (no repeat).
const COLUMNS = [
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 1', dir: 'down' as const, duration: 18 },
  { src: '/images/hero/slides/img2.png', alt: 'TEDxDamascus — moment 2', dir: 'up'   as const, duration: 22 },
  { src: '/images/hero/slides/img3.png', alt: 'TEDxDamascus — moment 3', dir: 'down' as const, duration: 20 },
  { src: '/images/hero/slides/img4.png', alt: 'TEDxDamascus — moment 4', dir: 'up'   as const, duration: 16 },
] as const;

// Horizontal offset per column: col-w (243px) minus the 50px overlap
const COL_OFFSET = 193;

const CIRCULAR_TEXT = 'Damascus where the story is told again ...  ·  ';

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t     = useTranslations('HomePage');
  const isRtl = locale === 'ar';
  const navRef = useRef<HTMLElement>(null);
  const [slidesEdge, setSlidesEdge] = useState(720);

  useEffect(() => {
    const measure = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setSlidesEdge(isRtl ? window.innerWidth - rect.right : rect.left);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isRtl]);

  return (
    <section
      className="relative w-full overflow-hidden h-[100svh] min-h-[716px] bg-page-bg"
      aria-label={t('title')}
    >
      <Navbar locale={locale} navRef={navRef} />

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

      {/* Gradient overlay — 55 %/72 % stops from Figma spec */}
      <div
        className={[
          'absolute top-0 h-[716px] pointer-events-none mix-blend-overlay z-[1] w-[1475px]',
          isRtl
            ? 'left-auto -right-[19px] bg-[image:var(--hero-gradient-rtl)]'
            : 'right-auto -left-[19px] bg-[image:var(--hero-gradient)]',
        ].join(' ')}
        aria-hidden
      />

      {/* ── Animated image columns ────────────────────────────────────────────────
       * Each column holds 2 stacked identical images; animating y by one image
       * height gives a seamless scroll that ends at the final position (no loop).
       */}
      <div
        className="hidden lg:block absolute z-[2] overflow-hidden w-[var(--hero-slides-outer-w)] h-[var(--hero-slide-col-h)] top-[var(--hero-slides-top)]"
        style={{ [isRtl ? 'right' : 'left']: slidesEdge }}
        aria-hidden
      >
        <div className="relative w-[var(--hero-slides-inner-w)] h-full">
          {COLUMNS.map((col, i) => {
            const isDown = col.dir === 'down';
            const yStart = isDown ? '-625.5px' : '0px';
            const yEnd   = isDown ? '0px'      : '-625.5px';

            return (
              <motion.div
                key={i}
                className="absolute top-0 w-[var(--hero-slide-col-w)]"
                style={{ [isRtl ? 'right' : 'left']: i * COL_OFFSET }}
                initial={{ y: yStart }}
                animate={{ y: yEnd }}
                transition={{
                  duration: col.duration,
                  ease: 'linear',
                  // no repeat — plays once then stays static
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.src}
                  alt={col.alt}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading="eager"
                  className="w-full h-[var(--hero-slide-img-h)] object-cover [filter:var(--hero-slide-filter)]"
                />
                {/* Second copy gives the scroll something to reveal */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.src}
                  alt=""
                  aria-hidden
                  loading="eager"
                  className="w-full h-[var(--hero-slide-img-h)] object-cover [filter:var(--hero-slide-filter)]"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Hero text — centered within the left text area (0 → slidesEdge) ─────
       * The block's width matches the text area so items-center truly centers it.
       */}
      <div
        className="absolute z-[10] top-[378px] flex flex-col items-center"
        style={{
          [isRtl ? 'right' : 'left']: 0,
          width: slidesEdge,
        }}
      >
        {/* "WE ARE" / "نحن" */}
        <h1
          className={[
            'font-helvetica font-light leading-[72px] select-none',
            'text-[60px] tracking-[0] text-secondary',
            isRtl ? 'font-arabic text-right' : 'text-center',
          ].join(' ')}
        >
          <SplitText
            text={t('heroWeAre')}
            tag="span"
            textAlign="center"
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

        {/* TEDx logo image + Damascus — tight flex row, centered */}
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Image
            src="/images/hero/tedx-hero.png"
            alt="TEDx"
            width={86}
            height={50}
            className="object-contain shrink-0"
            priority
          />
          <span
            className={[
              'font-helvetica font-light leading-none select-none',
              'text-[60px] tracking-[0] text-secondary',
            ].join(' ')}
          >
            <SplitText
              text="Damascus"
              tag="span"
              textAlign={isRtl ? 'right' : 'left'}
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
      </div>

      {/* ── Circular scroll badge — centered within the text area (0 → slidesEdge) */}
      <div
        className="absolute z-20 w-[200px] h-[200px] top-[592px]"
        style={{ [isRtl ? 'right' : 'left']: slidesEdge / 2 - 100 }}
      >
        <CircularText
          text={CIRCULAR_TEXT}
          spinDuration={20}
          onHover="slowDown"
          className="w-full h-full"
        />

        {/* Mouse-scroll icon — centred in 200×200 ring: (200−48)/2=76, (200−56)/2=72 */}
        <div className="absolute w-12 h-14 left-[76px] top-[72px]">
          <div className="absolute w-[16.59px] h-[25.71px] left-4 top-[10px] outline outline-[2.68px] outline-white [outline-offset:-1.34px] rounded-[8px]" />
          <div className="animate-scroll-wheel absolute w-[2.14px] h-[5.36px] left-[23.23px] top-[14.29px] bg-white rounded-[1px]" />
        </div>
      </div>
    </section>
  );
}
