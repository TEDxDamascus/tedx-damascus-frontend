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

export function Navbar({ locale, navRef }: NavbarProps) {
  const t = useTranslations('Navigation');
  const rawPathname = usePathname();
  const pathname = rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  const isRtl = locale === 'ar';

  // Build the alternate-locale href by swapping the locale segment
  const altLocale = isRtl ? 'en' : 'ar';
  const altHref = `/${altLocale}${pathname.replace(/^\/(en|ar)/, '')}` || `/${altLocale}`;

  // Nav links + language switcher, shared between the left (RTL) and right (LTR) columns
  const navAndSwitcher = (
    <div
      className={`hidden md:flex items-center gap-6 lg:gap-8 ${isRtl ? 'flex-row-reverse justify-start' : 'justify-end'}`}
    >
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        className={`flex items-center gap-6 lg:gap-8 pt-1 ${isRtl ? 'flex-row-reverse' : ''}`}
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
                  : 'text-secondary hover:opacity-80 transition-opacity',
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

      {/* Language switcher:
          English mode → "عربي" text + Syrian flag (shows target language)
          Arabic  mode → "EN" text */}
      <Link
        href={altHref}
        aria-label={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
        className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
      >
        {isRtl ? (
          <span className="font-helvetica text-sm font-semibold text-white tracking-wide leading-6">
            EN
          </span>
        ) : (
          <>
            <span className="font-helvetica text-base font-normal text-secondary leading-6 tracking-[0.15px]">
              عربي
            </span>
            <div className="w-6 h-6 relative overflow-hidden rounded-sm shrink-0">
              <Image
                src="/images/icons/flag-ar.png"
                alt="العربية"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </Link>
    </div>
  );

  return (
    /* CSS grid: 1fr | auto | 1fr
     * The auto center column is always visually centered regardless of
     * how wide the left/right columns are (both are 1fr = equal share). */
    <header
      className="absolute top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-8 sm:px-12 lg:px-16 xl:px-20 py-4"
    >
      {/* Left column — nav+switcher on RTL, empty spacer on LTR */}
      <div className={isRtl ? '' : ''}>
        {isRtl && navAndSwitcher}
      </div>

      {/* Center column — brand logo, always centered */}
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

      {/* Right column — nav+switcher on LTR, empty spacer on RTL */}
      <div className="flex justify-end">
        {!isRtl && navAndSwitcher}
      </div>
    </header>
  );
}
