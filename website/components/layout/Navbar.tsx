'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
  locale: string;
  navRef?: React.RefObject<HTMLElement | null>;
}

const NAV_ITEMS = [
  { key: 'home',     href: '/home'     },
  { key: 'events',   href: '/events'   },
  { key: 'speakers', href: '/speakers' },
  { key: 'team',     href: '/team'     },
  { key: 'partners', href: '/partners' },
  { key: 'blog',     href: '/blog'     },
  { key: 'about',    href: '/about'    },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]['key'];

function SyrianFlag() {
  return (
    <div className="w-6 h-6 relative overflow-hidden shrink-0">
      <div className="absolute left-0 w-full h-[5.33px] bg-[#007A3D]" style={{ top: 3.33 }} />
      <div className="absolute left-0 w-full h-[6.67px] bg-[#F1F1F1]" style={{ top: 8.67 }} />
      <div className="absolute left-0 w-full h-[5.33px] bg-[#101010]" style={{ top: 15.33 }} />
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 4.67,  top: 10 }} />
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 10,    top: 10 }} />
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 15.33, top: 10 }} />
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between">
      <motion.span animate={open ? { rotate: 45,  y: 8  } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} className="block h-0.5 w-full bg-white origin-center" />
      <motion.span animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.18 }} className="block h-0.5 w-full bg-white origin-center" />
      <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} className="block h-0.5 w-full bg-white origin-center" />
    </div>
  );
}

export function Navbar({ locale, navRef }: NavbarProps) {
  const t = useTranslations('Navigation');
  const rawPathname = usePathname();
  const pathname = rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  const isRtl = locale === 'ar';

  const altLocale = isRtl ? 'en' : 'ar';
  const altHref = `/${altLocale}${pathname.replace(/^\/(en|ar)/, '')}` || `/${altLocale}`;

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const langContent = isRtl ? (
    <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">EN</span>
  ) : (
    <>
      <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">عربي</span>
      <SyrianFlag />
    </>
  );

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-[80px] py-4">

        {/* ── Logo ─────────────────────────────────────────────────────────────── */}
        <div dir="ltr">
          <Link
            href={`/${locale}/home`}
            className="sm:hidden inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
          >
            <Image
              src="/images/icons/tedx-logo.png"
              alt="TEDxDamascus"
              width={55}
              height={32}
              priority
              className="object-contain [grid-column:1] [grid-row:1]"
            />
            <span className="[grid-column:1] [grid-row:1] ml-[57px] mt-[9px] text-[19px] font-helvetica font-light text-white leading-none select-none">
              Damascus
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[4px] mt-[25px] text-[11px] font-helvetica font-black text-primary leading-none select-none">
              x
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[14px] mt-[27px] text-[7px] font-helvetica font-bold text-white leading-none select-none">
              = independently organized TED event
            </span>
          </Link>

          <Link
            href={`/${locale}/home`}
            className="hidden sm:inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
          >
            <Image src="/images/icons/tedx-logo.png" alt="TEDxDamascus" width={100} height={58}
              className="object-contain [grid-column:1] [grid-row:1]" priority />
            <span className="[grid-column:1] [grid-row:1] ml-[104px] mt-[17px] text-[34px] font-helvetica font-light text-white leading-none select-none">
              Damascus
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[7px] mt-[51px] text-[13px] font-helvetica font-black text-primary leading-none select-none">
              x
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[17px] mt-[51px] text-[13px] font-helvetica font-bold text-white leading-none select-none">
              = independently organized TED event
            </span>
          </Link>
        </div>

        {/* ── Right side ───────────────────────────────────────────────────────── */}
        <div className="flex items-center">

          {/* Desktop nav + inline language switcher (xl+) */}
          <nav
            ref={navRef as React.RefObject<HTMLElement>}
            className="hidden xl:flex items-center gap-5 2xl:gap-7 pt-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ key, href }) => {
              const fullHref = `/${locale}${href}`;
              const isActive =
                pathname === fullHref ||
                pathWithoutLocale === href ||
                pathWithoutLocale.startsWith(href + '/') ||
                (key === 'home' && (
                  pathname === `/${locale}` ||
                  pathWithoutLocale === '/' ||
                  pathWithoutLocale === ''
                ));

              return (
                <Link
                  key={key}
                  href={fullHref}
                  dir="ltr"
                  className={[
                    'flex items-center gap-0.5 font-sans text-base font-normal tracking-[0.15px] transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-[#F1F1F1] hover:opacity-80',
                  ].join(' ')}
                >
                  {isActive && (
                    <Image src="/images/hero/indicator.png" alt="" width={28} height={28}
                      aria-hidden />
                  )}
                  <span dir={isRtl ? 'rtl' : 'ltr'}>{t(key as NavKey)}</span>
                </Link>
              );
            })}

            {/* Language switcher */}
            <Link
              href={altHref}
              aria-label={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
              className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              {langContent}
            </Link>
          </nav>

          {/* Mobile hamburger (< xl) */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="xl:hidden flex items-center justify-center w-10 h-10"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#101010] flex flex-col"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-[#EB0028]" />

            {/* Nav links */}
            <nav className="flex flex-col flex-1 justify-center px-8 gap-5" aria-label="Mobile navigation">
              {NAV_ITEMS.map(({ key, href }, i) => {
                const fullHref = `/${locale}${href}`;
                const isActive =
                  pathname === fullHref ||
                  pathWithoutLocale === href ||
                  pathWithoutLocale.startsWith(href + '/') ||
                  (key === 'home' && (
                    pathname === `/${locale}` ||
                    pathWithoutLocale === '/' ||
                    pathWithoutLocale === ''
                  ));

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 + 0.05, duration: 0.22 }}
                  >
                    <Link
                      href={fullHref}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        'font-helvetica text-3xl font-light block py-0.5 transition-colors',
                        isActive ? 'text-[#EB0028]' : 'text-[#F1F1F1] hover:text-[#EB0028]',
                      ].join(' ')}
                    >
                      <span dir={isRtl ? 'rtl' : 'ltr'}>{t(key as NavKey)}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Language switcher at bottom */}
            <div className="px-8 pb-10">
              <Link
                href={altHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-[#F1F1F1] hover:opacity-70 transition-opacity"
              >
                {langContent}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
