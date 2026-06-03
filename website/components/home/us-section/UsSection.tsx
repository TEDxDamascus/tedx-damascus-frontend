'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface UsSectionProps {
  locale: string;
}

const CARDS = [
  {
    key: 'team',
    collapsedImg: '/images/teams-partners/team-card.png',
    expandedImg:  '/images/teams-partners/team-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'organizers',
    collapsedImg: '/images/teams-partners/organizers-card.png',
    expandedImg:  '/images/teams-partners/organizers-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'speakers',
    collapsedImg: '/images/teams-partners/speakers-card.png',
    expandedImg:  '/images/teams-partners/speakers-color.jpg',
    objectPos:    'object-center',
  },
  {
    key: 'partners',
    collapsedImg: '/images/teams-partners/partners-card.png',
    expandedImg:  '/images/teams-partners/partners-color.jpg',
    objectPos:    'object-center',
  },
] as const;

const VIEWPORT = { once: true, margin: '-60px' as const };

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
          'px-6 sm:px-10 md:px-12 lg:px-[80px]',
          'pt-[40px] pb-[40px]',
          'flex flex-col md:flex-row',
          'gap-12 sm:gap-16 md:gap-10 lg:gap-12',
          isRtl ? 'md:flex-row-reverse' : '',
        ].join(' ')}
      >
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 32 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative shrink-0 w-full md:w-[340px] lg:w-[440px] flex flex-col items-center min-h-[240px] md:min-h-0"
        >
          <div className="absolute inset-0 pointer-events-none select-none flex items-start justify-center" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/teams-partners/Group.png"
              alt=""
              className="w-[280px] h-auto mt-4"
              draggable={false}
              loading="lazy"
            />
          </div>

          <div id="us-section-heading" className="relative z-10 w-full text-center">
            <div className="flex items-baseline gap-3 flex-wrap justify-center">
              <span
                className="font-helvetica font-normal text-primary leading-[1.167] tracking-[-1.5px] text-[clamp(58px,7.5vw,96px)]"
              >
                {t('ideasWord')}
              </span>
              <span
                className="font-medium text-white leading-[1.235] tracking-[0.25px] text-[clamp(20px,2.8vw,34px)] font-helvetica"
              >
                {t('growWord')}
              </span>
            </div>
            <p
              className="font-medium text-white leading-[1.235] tracking-[0.25px] text-[clamp(20px,2.8vw,34px)] mt-1 font-helvetica text-center"
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
              <motion.div
                key={card.key}
                animate={{ height: isActive ? 310 : 115 }}
                transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                initial={{ height: 115 }}
                className="relative overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                onMouseEnter={() => setActive(card.key)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(prev => prev === card.key ? null : card.key)}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={t(card.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(isActive ? null : card.key);
                  }
                }}
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
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
