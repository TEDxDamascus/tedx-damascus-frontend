'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CircularText } from './CircularText';
import { SplitText } from './SplitText';
import { Navbar } from '../../layout/Navbar';


const SLIDES = [
  { src: '/images/hero/slides/img1.png', alt: 'TEDxDamascus — moment 1', posClass: 'left-0 top-[21px]'      },
  { src: '/images/hero/slides/img2.png', alt: 'TEDxDamascus — moment 2', posClass: '-left-[9px] top-0'      },
  { src: '/images/hero/slides/img3.png', alt: 'TEDxDamascus — moment 3', posClass: '-left-[2px] top-0'      },
  { src: '/images/hero/slides/img4.png', alt: 'TEDxDamascus — moment 4', posClass: '-left-[9px] top-[75px]' },
  { src: '/images/hero/slides/img5.png', alt: 'TEDxDamascus — moment 5', posClass: 'left-0 top-0'           },
] as const;

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
      <div
        className={[
          'absolute top-0 h-[716px] pointer-events-none mix-blend-overlay z-[1] w-[1475px]',
          isRtl
            ? 'left-auto -right-[19px] bg-[image:var(--hero-gradient-rtl)]'
            : 'right-auto -left-[19px] bg-[image:var(--hero-gradient)]',
        ].join(' ')}
        aria-hidden
      />


      <div
        className="hidden lg:block absolute z-[2] w-[var(--hero-slides-outer-w)] h-[var(--hero-slide-col-h)] top-[var(--hero-slides-top)]"
        style={{ [isRtl ? 'right' : 'left']: slidesEdge }}
        aria-hidden
      >
        <div className="w-full h-full relative">
          <div
            className={[
              'absolute top-0 inline-flex justify-start items-center w-[var(--hero-slides-inner-w)]',
              isRtl ? 'right-0 left-auto flex-row-reverse' : 'left-0 right-auto flex-row',
            ].join(' ')}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={[
                  'relative w-[var(--hero-slide-col-w)] h-[var(--hero-slide-col-h)]',
                  i < SLIDES.length - 1 ? '-mr-[50px]' : 'mr-0',
                ].join(' ')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading="eager"
                  className={`absolute w-[var(--hero-slide-col-w)] h-[var(--hero-slide-img-h)] object-cover [filter:var(--hero-slide-filter)] ${slide.posClass}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={[
          'absolute z-[10] top-[378px] w-[477px] h-[155px]',
          isRtl ? 'right-[72px]' : 'left-[72px]',
        ].join(' ')}
      >
        {/* "WE ARE" */}
        <h1
          className={[
            'absolute font-helvetica font-light leading-[72px] select-none',
            'top-0 w-[477px] text-[60px] tracking-[0] text-secondary',
            isRtl ? 'right-0 left-auto text-right' : 'left-0 right-auto text-left',
          ].join(' ')}
        >
          <SplitText
            text="WE ARE"
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
        </h1>

        {/* TEDx — "TED" animated in, "x" as superscript */}
        <span
          className={[
            'absolute font-helvetica select-none',
            'top-[77.89px] text-[60px] font-black text-primary leading-none tracking-[0]',
            isRtl ? 'right-0 left-auto' : 'left-0 right-auto',
          ].join(' ')}
        >
          <SplitText
            text="TED"
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
          <sup className="text-[0.45em] font-black align-super tracking-[0]">x</sup>
        </span>

        {/* Damascus */}
        <span
          className={[
            'absolute font-helvetica font-light leading-[72px] select-none',
            'top-[77.89px] text-[60px] tracking-[0] text-secondary',
            isRtl ? 'right-[183.31px] left-auto' : 'left-[183.31px] right-auto',
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

      {/* ── z-20: Circular scroll badge
       * top-[592px] is static; left/right depends on slidesEdge (DOM measurement).
       */}
      <div
        className="absolute z-20 w-[200px] h-[200px] top-[592px]"
        style={{ [isRtl ? 'right' : 'left']: slidesEdge - 77 }}
      >
        <CircularText
          text={CIRCULAR_TEXT}
          spinDuration={20}
          onHover="slowDown"
          className="w-full h-full"
        />

        {/* Mouse-scroll icon — centred in 200×200 ring: (200−48)/2=76, (200−56)/2=72 */}
        <div className="absolute w-12 h-14 left-[76px] top-[72px]">
          {/* Mouse body */}
          <div className="absolute w-[16.59px] h-[25.71px] left-4 top-[10px] outline outline-[2.68px] outline-white [outline-offset:-1.34px] rounded-[8px]" />
          {/* Scroll wheel */}
          <div className="animate-scroll-wheel absolute w-[2.14px] h-[5.36px] left-[23.23px] top-[14.29px] bg-white rounded-[1px]" />
        </div>
      </div>
    </section>
  );
}
