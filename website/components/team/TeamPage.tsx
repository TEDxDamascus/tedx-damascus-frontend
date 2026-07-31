'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout/Navbar';
import { TeamCard } from './TeamCard';
import { TEAM_MEMBERS } from './data';

interface TeamPageProps {
  locale: string;
}

export function TeamPage({ locale }: TeamPageProps) {
  const t = useTranslations('Team');
  const isRtl = locale === 'ar';

  const members = TEAM_MEMBERS.map((m, i) => {
    const n = i + 1;
    return {
      ...m,
      name: t(`m${n}Name`),
      role: t(`m${n}Role`),
      category: t(`m${n}Category`),
    };
  });

  return (
    <section className="relative overflow-hidden bg-page-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-60" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/pattern.svg"
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
            loading="lazy"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-2/3 bg-[linear-gradient(to_bottom,#101010_0%,rgba(16,16,16,0.6)_55%,transparent_100%)]"
          aria-hidden
        />

        <div className="relative z-10">
          <Navbar locale={locale} />

          <div className="mx-auto max-w-[900px] px-6 pb-24 pt-40 text-center lg:pt-48">
            <h1
              className={[
                'font-helvetica text-[36px] font-normal leading-[1.2] text-white lg:text-[57px]',
                isRtl ? 'font-arabic' : '',
              ].join(' ')}
            >
              {t('heroTitleBefore')} <span className="text-primary">{t('heroTitleHighlight')}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* ── Our Team grid ── */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16">
        <h2
          className={[
            'mb-12 flex items-center gap-3 font-helvetica text-[28px] font-normal text-white lg:text-[34px]',
            isRtl ? 'font-arabic flex-row-reverse' : '',
          ].join(' ')}
        >
          <span className="inline-block h-8 w-1 bg-primary" aria-hidden />
          {t('sectionTitle')}
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <TeamCard
              key={m.slug}
              href={`/${locale}/team/${m.slug}`}
              photo={m.photo}
              name={m.name}
              role={m.role}
              category={m.category}
              isRtl={isRtl}
            />
          ))}
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24">
        <div className="relative flex flex-col items-start gap-6 overflow-hidden bg-card-bg p-8 sm:flex-row sm:items-center sm:justify-between lg:p-10">
          <div className="max-w-xl">
            <h3
              className={['font-helvetica text-[26px] font-normal text-white lg:text-[32px]', isRtl ? 'font-arabic' : ''].join(
                ' '
              )}
            >
              {t('ctaTitle')}
            </h3>
            <p className={['mt-3 font-helvetica text-[15px] leading-[1.6] text-[#a8a8a8]', isRtl ? 'font-arabic' : ''].join(' ')}>
              {t('ctaDesc')}
            </p>
          </div>
          <Link
            href={`/${locale}/volunteer`}
            className="inline-flex h-14 shrink-0 items-center justify-center whitespace-nowrap bg-primary px-8 font-helvetica text-[15px] font-medium uppercase tracking-[0.4px] text-[#f1f1f1] transition-opacity hover:opacity-90"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}
