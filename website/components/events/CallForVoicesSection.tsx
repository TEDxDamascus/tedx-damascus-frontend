'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface CallForVoicesSectionProps {
  locale: string;
}

const CARDS = [
  {
    key: 'team' as const,
    collapsedImg: '/images/teams-partners/team-card.png',
    expandedImg: '/images/teams-partners/team-color.jpg',
    href: '/forms/volunteer',
    cta: 'nominateCta' as const,
  },
  {
    key: 'organizers' as const,
    collapsedImg: '/images/teams-partners/organizers-card.png',
    expandedImg: '/images/teams-partners/organizers-color.jpg',
    href: '/forms/volunteer',
    cta: 'nominateCta' as const,
  },
  {
    key: 'speakers' as const,
    collapsedImg: '/images/teams-partners/speakers-card.png',
    expandedImg: '/images/teams-partners/speakers-color.jpg',
    href: 'https://forms.gle/bQhuvrwVWSp1k72AA',
    cta: 'applyCta' as const,
  },
  {
    key: 'partners' as const,
    collapsedImg: '/images/teams-partners/partners-card.png',
    expandedImg: '/images/teams-partners/partners-color.jpg',
    href: '/forms/volunteer',
    cta: 'nominateCta' as const,
  },
] as const;

const VIEWPORT = { once: true, margin: '-60px' as const };

export function CallForVoicesSection({ locale }: CallForVoicesSectionProps) {
  const t = useTranslations('CallForVoices');
  const tUs = useTranslations('UsSection');
  const isRtl = locale === 'ar';
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      className="w-full bg-page-bg px-6 sm:px-12 lg:px-16 xl:px-[160px] py-16"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="text-white text-[32px] sm:text-[40px] lg:text-[48px] font-normal leading-tight lg:leading-[72px] mb-8 font-helvetica"
      >
        {t('title')}
      </motion.h2>

      {/* ── md+ screen: horizontal accordion ───────────────────────────────── */}
      <div className="hidden md:flex flex-row gap-3 h-[380px] lg:h-[420px]">
        {CARDS.map((card, idx) => {
          const isActive = active === card.key;
          return (
            <div
              key={`h-${card.key}`}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={tUs(card.key)}
              onMouseEnter={() => setActive(card.key)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(prev => prev === card.key ? null : card.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(isActive ? null : card.key);
                }
              }}
              className="relative overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              style={{
                flex: `${isActive ? 3 : 1} 1 0`,
                minWidth: 0,
                transition: 'flex 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.45, delay: idx * 0.07, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.collapsedImg}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                  draggable={false}
                  loading="lazy"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.expandedImg}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60" />

                <div
                  className="absolute bottom-0 left-[28px] translate-y-[75%] pointer-events-none select-none"
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/teams-partners/Vector (3).png"
                    alt=""
                    className="w-[160px] h-auto"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                <div className="relative z-10 flex flex-col h-full px-7 py-8 items-start justify-end">
                  <p
                    className="text-primary font-medium font-helvetica leading-tight break-words"
                    style={{ fontSize: 'clamp(18px, 1.8vw, 30px)', letterSpacing: 0.25 }}
                  >
                    {tUs(card.key)}
                  </p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: 0.18 }}
                      className="mt-3"
                    >
                      <Link
                        href={card.href.startsWith('http') ? card.href : `/${locale}${card.href}`}
                        className="font-helvetica hover:underline"
                        style={{
                          color: '#EB0028',
                          fontSize: 15,
                          fontWeight: 400,
                          lineHeight: '22px',
                          letterSpacing: 0.15,
                          display: 'block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t(card.cta)}
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ── Small only: vertical accordion ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-3">
        {CARDS.map((card, idx) => {
          const isActive = active === card.key;

          return (
            <motion.div
              key={`v-${card.key}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.45, delay: idx * 0.07, ease: 'easeOut' }}
              animate={{ height: isActive ? 310 : 115 }}
              style={{ height: 115 }}
              className="relative overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              onMouseEnter={() => setActive(card.key)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(prev => prev === card.key ? null : card.key)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={tUs(card.key)}
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
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                draggable={false}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.expandedImg}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                draggable={false}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60" />

              <div
                className="absolute bottom-0 left-[42px] translate-y-[75%] pointer-events-none select-none"
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/teams-partners/Vector (3).png"
                  alt=""
                  className="w-[200px] h-auto"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              <div
                className={`relative z-10 flex flex-col h-full px-[42px] py-[36px] items-start ${isActive ? 'justify-between' : 'justify-center'}`}
              >
                <p
                  className="text-primary font-medium break-words font-helvetica"
                  style={{ fontSize: 34, lineHeight: '41.99px', letterSpacing: 0.25 }}
                >
                  {tUs(card.key)}
                </p>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.18 }}
                  >
                    <Link
                      href={card.href.startsWith('http') ? card.href : `/${locale}${card.href}`}
                      className="font-helvetica hover:underline"
                      style={{
                        color: '#EB0028',
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: '24px',
                        letterSpacing: 0.15,
                        display: 'block',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t(card.cta)}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
