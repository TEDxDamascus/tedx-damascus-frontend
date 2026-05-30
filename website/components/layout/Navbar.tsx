'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

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

// Syrian flag rendered as inline CSS — exact match to Figma spec (24×24 px)
function SyrianFlag() {
  return (
    <div className="w-6 h-6 relative overflow-hidden shrink-0">
      {/* Green stripe */}
      <div className="absolute left-0 w-full h-[5.33px] bg-[#007A3D]" style={{ top: 3.33 }} />
      {/* White stripe */}
      <div className="absolute left-0 w-full h-[6.67px] bg-[#F1F1F1]" style={{ top: 8.67 }} />
      {/* Black stripe */}
      <div className="absolute left-0 w-full h-[5.33px] bg-[#101010]" style={{ top: 15.33 }} />
      {/* Three red stars on white stripe */}
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 4.67, top: 10 }} />
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 10,   top: 10 }} />
      <div className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]" style={{ left: 15.33, top: 10 }} />
    </div>
  );
}

export function Navbar({ locale, navRef }: NavbarProps) {
  const t = useTranslations('Navigation');
  const rawPathname = usePathname();
  const pathname = rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  const isRtl = locale === 'ar';

  const altLocale = isRtl ? 'en' : 'ar';
  const altHref = `/${altLocale}${pathname.replace(/^\/(en|ar)/, '')}` || `/${altLocale}`;

  return (
    /* Figma spec: paddingLeft/Right 80px, paddingTop/Bottom 16px, space-between */
    <header
      className={[
        'absolute top-0 left-0 right-0 z-50',
        'relative flex items-center justify-between',
        'px-[80px] py-4',
        isRtl ? 'flex-row-reverse' : '',
      ].join(' ')}
    >

      {/* ── Left: brand block ─────────────────────────────────────────────────── */}
      <div>
        <Link
          href={`/${locale}/home`}
          className="shrink-0 inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
        >
          <Image
            src="/images/icons/tedx-logo.png"
            alt="TEDxDamascus"
            width={100}
            height={58}
            className="object-contain [grid-column:1] [grid-row:1]"
            priority
          />
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

      {/* ── Center: language switcher ─────────────────────────────────────────── */}
      <Link
        href={altHref}
        aria-label={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
      >
        {isRtl ? (
          <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">
            EN
          </span>
        ) : (
          <>
            <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">
              عربي
            </span>
            <SyrianFlag />
          </>
        )}
      </Link>

      {/* ── Right: nav links ──────────────────────────────────────────────────── */}
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        className={[
          'hidden md:flex items-center gap-6 lg:gap-8 pt-1',
          isRtl ? 'flex-row-reverse' : '',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ key, href }) => {
          const fullHref = `/${locale}${href}`;
          const isActive = pathname === fullHref;

          return (
            <Link
              key={key}
              href={fullHref}
              className={[
                'flex items-center gap-0.5 font-sans text-base font-normal tracking-[0.15px]',
                'transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-[#F1F1F1] hover:opacity-80 transition-opacity',
                isRtl ? 'flex-row-reverse' : '',
              ].join(' ')}
            >
              {isActive && (
                <Image
                  src="/images/hero/indicator.png"
                  alt=""
                  width={28}
                  height={28}
                  className={isRtl ? 'rotate-180' : ''}
                  aria-hidden
                />
              )}
              {t(key as NavKey)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
