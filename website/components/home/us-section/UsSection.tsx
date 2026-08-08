'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UsSectionProps {
  locale: string;
}

const CARDS = [
  {
    key: 'team',
    href: '/team',
    collapsedImg: '/images/teams-partners/team-card.png',
    expandedImg:  '/images/teams-partners/team-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'organizers',
    href: '/organizers',
    collapsedImg: '/images/teams-partners/organizers-card.png',
    expandedImg:  '/images/teams-partners/organizers-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'speakers',
    href: '/speakers',
    collapsedImg: '/images/teams-partners/speakers-card.png',
    expandedImg:  '/images/teams-partners/speakers-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'partners',
    href: '/partners',
    collapsedImg: '/images/teams-partners/partners-card.png',
    expandedImg:  '/images/teams-partners/partners-color.jpg',
    objectPos:    'object-center',
  },
] as const;

const VIEWPORT = { once: true, margin: '-60px' as const };
const MotionLink = motion(Link);

export function UsSection({ locale }: UsSectionProps) {
  const t     = useTranslations('UsSection');
  const isRtl = locale === 'ar';
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      className="relative bg-page-bg overflow-hidden pt-20"
      aria-labelledby="us-section-heading"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className={[
          'relative z-10 max-w-[1440px] mx-auto',
          'px-4 sm:px-10 md:px-12 lg:px-[80px]',
          'pt-[40px] pb-[40px]',
          'flex flex-row',
          'gap-4 sm:gap-10 md:gap-10 lg:gap-12',
          isRtl ? 'flex-row-reverse' : '',
        ].join(' ')}
      >
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 32 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative shrink-0 w-[130px] sm:w-[220px] md:w-[340px] lg:w-[440px] self-stretch"
        >
          {/* Decorative graphic — covers full panel on mobile, natural size on desktop */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden sm:flex sm:items-start sm:justify-center" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/teams-partners/Group.png"
              alt=""
              className="w-full h-full object-cover object-center sm:h-auto sm:w-[280px] sm:mt-4"
              draggable={false}
              loading="lazy"
            />
          </div>

          {/* Text — top-1/2 + -translate-y-1/2 is the only reliable vertical-center for absolute children */}
          <div id="us-section-heading" className="absolute top-1/2 left-0 right-0 z-10 -translate-y-1/2 text-center px-2">
            <div className="flex items-baseline gap-2 flex-wrap justify-center w-full">
              <span
                className="font-helvetica font-normal text-primary leading-[1.167] tracking-[-1.5px] text-[clamp(28px,7.5vw,96px)]"
              >
                {t('ideasWord')}
              </span>
              <span
                className="font-medium text-white leading-[1.235] tracking-[0.25px] text-[clamp(12px,2.8vw,34px)] font-helvetica"
              >
                {t('growWord')}
              </span>
            </div>
            <p
              className="font-medium text-white leading-[1.235] tracking-[0.25px] text-[clamp(10px,2.8vw,34px)] mt-1 font-helvetica"
            >
              {t('subtitle')}
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: isRtl ? -32 : 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-col gap-3 w-full md:flex-1 min-w-0"
        >
          {CARDS.map((card) => {
            const isActive = active === card.key;

            return (
              <MotionLink
                key={card.key}
                href={`/${locale}${card.href}`}
                animate={{ height: isActive ? 310 : 115 }}
                transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                initial={{ height: 115 }}
                className="relative block overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                onMouseEnter={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                    setActive(card.key);
                  }
                }}
                onMouseLeave={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                    setActive(null);
                  }
                }}
                aria-label={t(card.key)}
              >
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.collapsedImg}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover ${card.objectPos} transition-opacity duration-400 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                  draggable={false}
                  loading="lazy"
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.expandedImg}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover ${card.objectPos} transition-opacity duration-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  draggable={false}
                  loading="lazy"
                />
                <div className={`relative z-10 flex flex-col h-full px-4 md:px-6 lg:px-[42px] py-5 lg:py-[36px] items-start ${isActive ? 'justify-between' : 'justify-center'}`}>
                  <p className="text-primary text-[clamp(20px,2.8vw,34px)] font-helvetica font-medium leading-tight lg:leading-[41.99px] tracking-[0.25px] break-words">
                    {t(card.key)}
                  </p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: 0.18 }}
                    >
                      <p
                        className={`font-bold text-white relative z-10 text-[clamp(16px,1.8vw,24px)] leading-[1.334] -mb-[6px] font-helvetica ${isRtl ? 'text-right' : ''}`}
                      >
                        {t(`${card.key}Subtitle`)}
                      </p>
                      <div className="pointer-events-none w-full max-w-[520px]" aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/teams-partners/Vector (3).png"
                          alt=""
                          className="w-full h-auto block"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </MotionLink>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
