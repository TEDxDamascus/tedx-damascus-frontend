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

  return (
    <header
      className={[
        'absolute top-0 left-0 right-0 z-50',
        'flex items-center justify-between',
        'px-8 sm:px-12 lg:px-16 xl:px-20 py-4',
        isRtl ? 'flex-row-reverse' : '',
      ].join(' ')}
    >

      <Link
        href={`/${locale}/home`}
        className="shrink-0 group inline-grid grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
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
      <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <nav
          ref={navRef as React.RefObject<HTMLElement>}
          className={`hidden md:flex items-center gap-6 lg:gap-8 pt-1 ${isRtl ? 'flex-row-reverse' : ''}`}
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
      </div>
    </header>
  );
}
