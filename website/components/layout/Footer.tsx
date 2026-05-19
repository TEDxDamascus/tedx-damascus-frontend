'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

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

const SOCIAL_LINKS = [
  { Icon: Facebook,  href: 'https://www.facebook.com/TEDxDamascus', label: 'Facebook'  },
  { Icon: Instagram, href: 'https://www.instagram.com/TEDxDamascus', label: 'Instagram' },
  { Icon: Linkedin,  href: 'https://www.linkedin.com/company/TEDxDamascus', label: 'LinkedIn'  },
];

export function Footer({ locale }: FooterProps) {
  const t    = useTranslations('Footer');
  const tNav = useTranslations('Navigation');
  const isRtl = locale === 'ar';

  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <footer className="bg-primary w-full" aria-label="Site footer" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[165px] pt-16 lg:pt-[100px]">
        <div className={`flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-[17px] mb-5 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

          <h2 className="font-helvetica text-[22px] sm:text-[28px] lg:text-[34px] font-medium leading-[1.235] tracking-[0.25px] text-black lg:max-w-[55%]">
            {t('tagline')}
          </h2>

          <form
            onSubmit={handleSubmit}
            className={`flex items-end gap-[9px] w-full lg:flex-1 lg:justify-end ${isRtl ? 'flex-row-reverse' : ''}`}
            noValidate
          >
            <div className={`flex flex-col gap-[6px] w-full sm:w-[360px] ${isRtl ? 'items-end' : ''}`}>
              <label
                htmlFor="footer-email"
                className="font-helvetica text-[20px] font-medium leading-[1.2] tracking-[0.15px] text-black"
              >
                {t('emailLabel')}
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitted}
                className={[
                  'bg-transparent border-0 border-b-2 border-black outline-none',
                  'text-black placeholder:text-black/50 font-helvetica text-base pb-1 w-full',
                  'focus:border-black/70 transition-colors disabled:opacity-60',
                  isRtl ? 'text-right' : '',
                ].join(' ')}
              />
              {submitted && (
                <span className="text-black/75 text-sm font-helvetica mt-0.5">
                  {t('submitted')}
                </span>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ opacity: 0.85 }}
              whileTap={{ scale: 0.97 }}
              disabled={submitted}
              className="bg-black text-white font-helvetica text-base font-normal tracking-[0.15px] px-6 py-3 whitespace-nowrap disabled:opacity-60 transition-opacity"
            >
              {t('submit')}
            </motion.button>
          </form>
        </div>

        <hr className="border-0 border-t border-black/25 w-full mb-5" />

        <div className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-10 pb-8 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>

          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-1">
              <Link
                href={`/${locale}/home`}
                className="inline-flex items-baseline gap-0.5 group"
                aria-label="TEDx Damascus — home"
              >
                <span className="font-manrope font-extrabold text-[1.6rem] leading-none text-black group-hover:opacity-80 transition-opacity">
                  TED
                  <sup className="text-[0.45em] align-super leading-none">x</sup>
                  {' '}Damascus
                </span>
              </Link>
              <p className="font-helvetica text-[12px] font-normal leading-[1.5] tracking-[0.4px] text-black max-w-[285px]">
                {t('license')}
              </p>
            </div>

            <div className={`flex gap-[10px] items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-black hover:opacity-70 transition-opacity"
                >
                  <Icon size={24} strokeWidth={1.75} aria-hidden />
                </motion.a>
              ))}
            </div>
          </div>

          <div className={`flex gap-8 sm:gap-12 items-start text-black font-helvetica text-base font-bold leading-6 tracking-[0.15px] ${isRtl ? 'flex-row-reverse' : ''}`}>

            <nav aria-label={isRtl ? 'روابط عن' : 'About links'}>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {ABOUT_LINKS.map(({ key, href }) => (
                  <li key={key}>
                    <Link
                      href={`/${locale}${href}`}
                      className="hover:underline underline-offset-2 transition-all"
                    >
                      {tNav(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={isRtl ? 'روابط استكشاف' : 'Explore links'}>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {EXPLORE_LINKS.map(({ key, href }) => (
                  <li key={key}>
                    <Link
                      href={`/${locale}${href}`}
                      className="hover:underline underline-offset-2 transition-all"
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
      <div className="relative w-full h-[149px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/footer/damascus%20skyline.png"
          alt="Damascus city skyline silhouette"
          className="w-full h-full object-cover object-bottom select-none"
          draggable={false}
          loading="lazy"
        />
      </div>
    </footer>
  );
}
