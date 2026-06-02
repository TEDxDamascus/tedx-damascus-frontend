'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { newsletterApi } from '@/lib/api/client';

interface FooterProps {
  locale: string;
}

const ABOUT_LINKS = [
  { key: 'about'    as const, href: '/about'    },
  { key: 'team'     as const, href: '/team'     },
  { key: 'partners' as const, href: '/partners' },
];

const EXPLORE_LINKS = [
  { key: 'home'     as const, href: '/home'     },
  { key: 'events'   as const, href: '/events'   },
  { key: 'speakers' as const, href: '/speakers' },
  { key: 'blog'     as const, href: '/blog'     },
];

// Mobile: interleaved 2-col grid (Figma node 21-3979)
const MOBILE_NAV_LINKS = [
  { key: 'about'    as const, href: '/about'    },
  { key: 'home'     as const, href: '/home'     },
  { key: 'team'     as const, href: '/team'     },
  { key: 'events'   as const, href: '/events'   },
  { key: 'partners' as const, href: '/partners' },
  { key: 'speakers' as const, href: '/speakers' },
  { key: 'blog'     as const, href: '/blog'     },
];

const SOCIAL_LINKS = [
  { src: '/images/footer/Facebook.svg',  href: 'https://www.facebook.com/TEDxDamascus',         label: 'Facebook'  },
  { src: '/images/footer/Instagram.svg', href: 'https://www.instagram.com/TEDxDamascus',        label: 'Instagram' },
  { src: '/images/footer/Linkedin.svg',  href: 'https://www.linkedin.com/company/TEDxDamascus', label: 'LinkedIn'  },
];

// Positions from Figma (1440 × 149 canvas). % of full footer width keeps border
// vectors flush with the footer edge at any viewport on desktop.
const SKYLINE_VECTORS = [
  { name: 'Vector 30', left:  0.28, top: 62, width:  3.89, height:  87, delay: 0    },
  { name: 'Vector 3',  left: 91.04, top: 30, width:  8.96, height: 118, delay: 0    },
  { name: 'Vector 31', left:  5.00, top: 59, width:  1.81, height:  90, delay: 0.15 },
  { name: 'Vector 28', left: 86.46, top: 61, width:  3.89, height:  87, delay: 0.15 },
  { name: 'Vector 4',  left:  7.01, top: 44, width: 18.82, height: 104, delay: 0.30 },
  { name: 'Vector 29', left: 83.75, top: 61, width:  1.81, height:  90, delay: 0.30 },
  { name: 'Vector 32', left: 26.39, top: 30, width:  4.72, height: 118, delay: 0.45 },
  { name: 'Vector 27', left: 79.44, top: 67, width:  3.33, height:  81, delay: 0.45 },
  { name: 'Vector 1',  left: 32.08, top:  2, width:  7.15, height: 161, delay: 0.60 },
  { name: 'Vector 2',  left: 70.69, top: 39, width:  8.19, height: 112, delay: 0.60 },
  { name: 'Vector 25', left: 39.51, top: 68, width:  3.33, height:  81, delay: 0.75 },
  { name: 'Vector 26', left: 66.74, top:  0, width:  2.50, height: 148, delay: 0.75 },
  { name: 'Vector 5',  left: 45.21, top: 36, width:  1.74, height: 120, delay: 0.90 },
  { name: 'Vector 6',  left: 47.43, top: 68, width: 18.13, height:  83, delay: 0.90 },
] as const;

// Stable style objects — avoids cursor/focus reset bugs from inline object recreation
const EMAIL_UNDERLINE_STYLE: React.CSSProperties = {
  border: 'none',
  borderBottom: '2px solid black',
  borderRadius: 0,
  outline: 'none',
  boxShadow: 'none',
};

const EMAIL_BOX_STYLE: React.CSSProperties = {
  border: '1px solid black',
  borderRadius: 0,
  outline: 'none',
  boxShadow: 'none',
};

export function Footer({ locale }: FooterProps) {
  const t    = useTranslations('Footer');
  const tNav = useTranslations('Navigation');
  const isRtl = locale === 'ar';

  const [email, setEmail]           = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // useInView on the container — not on the vectors themselves. The vectors
  // start at y:160 outside the overflow-hidden boundary so IntersectionObserver
  // would never see them as "in viewport" if we used whileInView directly.
  const skylineRef    = useRef<HTMLDivElement>(null);
  const skylineInView = useInView(skylineRef, { once: true, margin: '0px 0px -20px 0px' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
    } catch {
      // Always show success — don't block UX on API errors
    } finally {
      setLoading(false);
      setEmail('');        // Clear the field so the user can type again
      setSubmitted(true);
      setShowDialog(true);
    }
  }

  const socialIcons = SOCIAL_LINKS.map(({ src, href, label }) => (
    <motion.a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="shrink-0 hover:opacity-70 transition-opacity"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={24} height={24} className="block select-none" aria-hidden draggable={false} />
    </motion.a>
  ));

  return (
    <>
      <footer
        className="w-full overflow-hidden"
        style={{ background: 'var(--footer-bg)' }}
        aria-label="Site footer"
        dir={isRtl ? 'rtl' : 'ltr'}
      >

        {/* ══════════════════════════════════════════════════
            DESKTOP  ≥ md (768 px)
            ══════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          <div className="flex flex-col max-w-[1440px] mx-auto pt-[100px] px-6 lg:px-[82px] gap-6">

            {/* ── Upper row: tagline + email + subscribe ── */}
            <div className="flex w-full items-center gap-8">

              <p className="font-helvetica text-black shrink-0 break-words w-[55%] max-w-[700px] text-[34px] font-medium leading-[41.99px] tracking-[0.25px]">
                {t('tagline')}
              </p>

              {/* Underline email input — Figma: items-end, flex-1 */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-1 min-w-0 items-end gap-3">
                <label htmlFor="footer-email" className="sr-only">{t('emailLabel')}</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder={submitted ? t('submitted') : t('emailLabel')}
                  className="footer-input font-helvetica bg-transparent text-base font-normal leading-6 tracking-[0.15px] text-black placeholder:text-black/80 disabled:opacity-60 flex-1 min-w-0 pb-2 focus:ring-0 focus:shadow-none"
                  style={EMAIL_UNDERLINE_STYLE}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ opacity: 0.85 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-helvetica shrink-0 bg-[#101010] text-[#F1F1F1] px-6 py-4 text-base font-normal leading-6 tracking-[0.15px] disabled:opacity-60 transition-opacity"
                >
                  {loading ? '…' : t('subscribe')}
                </motion.button>
              </form>
            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px bg-black" />

            {/* ── Bottom row: logo/social + nav ── */}
            <div className="flex w-full items-start gap-4 pb-8">

              <div className="flex flex-1 flex-col items-start gap-9">
                <div className="flex flex-col items-start w-full">
                  {/*
                    dir="ltr" keeps the TEDx brand logo always left-to-right
                    regardless of the page locale — the logo is a fixed brand asset.
                  */}
                  <div className="flex items-center gap-[5px] -mb-[6px]" dir="ltr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/footer/Rectangle (1).png"
                      alt="TEDx"
                      width={106}
                      height={64}
                      className="select-none object-contain object-bottom"
                      draggable={false}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/footer/Damascus.svg"
                      alt="Damascus"
                      width={171}
                      height={27}
                      className="select-none object-contain"
                      draggable={false}
                    />
                  </div>
                  <p className="font-helvetica text-black break-words text-xs font-normal leading-[18px] tracking-[0.4px]">
                    {t('license')}
                  </p>
                </div>

                <div className="flex items-center gap-[10px] w-[88px]">
                  {socialIcons}
                </div>
              </div>

              <div className="flex items-start shrink-0 justify-between w-[189px]">
                <nav aria-label={isRtl ? 'روابط عن' : 'About links'}>
                  <ul className="flex flex-col gap-2 list-none m-0 p-0 w-[77px]">
                    {ABOUT_LINKS.map(({ key, href }) => (
                      <li key={key}>
                        <Link
                          href={`/${locale}${href}`}
                          className="font-helvetica text-black block break-words hover:underline underline-offset-2 transition-all text-base font-bold leading-6 tracking-[0.15px]"
                        >
                          {tNav(key)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label={isRtl ? 'روابط استكشاف' : 'Explore links'}>
                  <ul className="flex flex-col gap-2 list-none m-0 p-0 w-[81px]">
                    {EXPLORE_LINKS.map(({ key, href }) => (
                      <li key={key}>
                        <Link
                          href={`/${locale}${href}`}
                          className="font-helvetica text-black block break-words hover:underline underline-offset-2 transition-all text-base font-bold leading-6 tracking-[0.15px]"
                        >
                          {tNav(key)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            MOBILE  < md (768 px)   — Figma node 21-3979
            ══════════════════════════════════════════════════ */}
        <div className="md:hidden">
          <div className="flex flex-col px-6 pt-20 pb-32 gap-10">

            <p className="font-manrope font-extrabold text-black w-full text-[20px] leading-[25px]">
              {t('tagline')}
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
              <label htmlFor="footer-email-mobile" className="sr-only">{t('emailLabel')}</label>
              <input
                id="footer-email-mobile"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder={submitted ? t('submitted') : t('emailLabel')}
                className="footer-input font-sans bg-transparent w-full text-base text-black placeholder:text-black/80 disabled:opacity-60 px-[13px] py-[19px] focus:ring-0 focus:shadow-none"
                style={EMAIL_BOX_STYLE}
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.97 }}
                className="font-sans font-bold bg-black text-white uppercase self-start disabled:opacity-60 transition-opacity tracking-[1.2px] text-xs leading-4 py-3 px-10"
              >
                {loading ? '…' : t('subscribe')}
              </motion.button>
            </form>

            <div className="flex flex-col gap-2 w-full pt-6">

              {/* dir="ltr" — brand logo always left-to-right regardless of locale */}
              <div className="flex items-center gap-[5px] mb-0.5" dir="ltr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/footer/Rectangle (1).png"
                  alt="TEDx"
                  width={70}
                  height={42}
                  className="select-none object-contain object-bottom"
                  draggable={false}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/footer/Damascus.svg"
                  alt="Damascus"
                  width={112}
                  height={18}
                  className="select-none object-contain"
                  draggable={false}
                />
              </div>

              <p className="font-sans font-bold text-black uppercase break-words w-full text-[9px] leading-[13.5px] opacity-70">
                {t('license')}
              </p>

              <div className="flex items-center gap-[10px] w-[88px]">
                {socialIcons}
              </div>

              <div className="grid grid-cols-2 gap-y-2 w-full pt-10">
                {MOBILE_NAV_LINKS.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={`/${locale}${href}`}
                    className="font-sans font-black text-black uppercase hover:underline underline-offset-2 transition-all text-xs leading-4 tracking-[1.2px]"
                  >
                    {tNav(key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            Damascus skyline
            Desktop: individual vectors with scroll-triggered staggered animation
                     (whileInView fires each time the element enters the viewport)
            Mobile:  city-silhouette.png — single image, no distortion on narrow screens
            ══════════════════════════════════════════════════ */}
        <div ref={skylineRef} className="relative w-full overflow-hidden h-[149px]">

          {/* Desktop — staggered slide-up, driven by the container's in-view state.
              whileInView cannot be used here: the vectors start at y:160, outside
              the overflow-hidden clip region, so IntersectionObserver never sees
              them as "in viewport". useInView on the container solves this. */}
          <div className="hidden md:block absolute inset-0">
            {SKYLINE_VECTORS.map(({ name, left, top, width, height, delay }) => (
              <motion.img
                key={name}
                src={`/images/footer/${name}.png`}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute select-none pointer-events-none"
                style={{ left: `${left}%`, top, width: `${width}%`, height, objectFit: 'fill' }}
                initial={{ y: 160, opacity: 0 }}
                animate={skylineInView ? { y: 0, opacity: 1 } : { y: 160, opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
              />
            ))}
          </div>

          {/* Mobile — city silhouette PNG, contained + bottom-aligned on the red bg */}
          <div className="md:hidden absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer/city-silhouette.png"
              alt=""
              aria-hidden
              draggable={false}
              className="w-full h-full object-contain object-bottom select-none pointer-events-none"
            />
          </div>

          {/* Black bar at very bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[9px] bg-black pointer-events-none" />
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════
          Thank-you dialog — shown after successful subscription
          ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            key="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={() => setShowDialog(false)}
          >
            <motion.div
              key="dialog-panel"
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0d0d0d] text-white max-w-sm w-full px-8 py-10 text-center border border-[#EB0028]/25"
              dir={isRtl ? 'rtl' : 'ltr'}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Checkmark icon */}
              <div className="w-16 h-16 rounded-full bg-[#EB0028]/15 flex items-center justify-center mx-auto mb-6">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EB0028" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="font-helvetica text-xl font-bold leading-tight mb-3">
                {t('dialogTitle')}
              </h2>
              <div className="w-8 h-px bg-[#EB0028] mx-auto my-4" />
              <p className="font-helvetica text-sm leading-6 text-white/70 mb-8">
                {t('dialogMessage')}
              </p>
              <motion.button
                onClick={() => setShowDialog(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="font-helvetica border border-[#EB0028] text-[#EB0028] px-8 py-3 text-sm font-bold tracking-[0.5px] uppercase hover:bg-[#EB0028]/10 transition-colors"
              >
                {t('dialogClose')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
