'use client';

import { useTranslations } from 'next-intl';
import { Linkedin, Share2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { TEAM_MEMBERS } from './data';

interface MemberDetailProps {
  locale: string;
  /** 1-based member index, matching the m{n}* translation keys. */
  index: number;
}

export function MemberDetail({ locale, index }: MemberDetailProps) {
  const tTeam = useTranslations('Team');
  const tMember = useTranslations('TeamMember');
  const isRtl = locale === 'ar';
  const n = index;

  const photo = TEAM_MEMBERS[index - 1].photo;
  const name = tTeam(`m${n}Name`);
  const role = tTeam(`m${n}Role`);
  const category = tTeam(`m${n}Category`);

  const initiatives = [
    { title: tMember(`m${n}Initiative1Title`), desc: tMember(`m${n}Initiative1Desc`) },
    { title: tMember(`m${n}Initiative2Title`), desc: tMember(`m${n}Initiative2Desc`) },
  ];

  return (
    <div className="relative bg-page-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero: navbar + profile photo with corner brackets + identity ── */}
      <section className="relative overflow-hidden">
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

          <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-32 lg:pt-40">
            <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-16">
              {/* Photo with L-bracket corner accents */}
              <div className="relative mx-auto w-full max-w-[380px] shrink-0 lg:mx-0 lg:w-[420px] lg:max-w-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/border-top-right.png"
                  alt=""
                  className="pointer-events-none absolute -right-3 -top-3 z-10 h-10 w-10 select-none lg:h-12 lg:w-12"
                  aria-hidden
                  draggable={false}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/border-bottom-left.png"
                  alt=""
                  className="pointer-events-none absolute -bottom-3 -left-3 z-10 h-10 w-10 select-none lg:h-12 lg:w-12"
                  aria-hidden
                  draggable={false}
                />
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={name} className="h-full w-full object-cover" draggable={false} />
                </div>
              </div>

              {/* Identity */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className={['font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-white/60', isRtl ? 'font-arabic' : ''].join(' ')}>
                    {category}
                  </span>
                </div>

                <h1
                  className={[
                    'font-helvetica text-[40px] font-normal uppercase leading-[1.1] text-white lg:text-[57px]',
                    isRtl ? 'font-arabic' : '',
                  ].join(' ')}
                >
                  {name}
                </h1>

                <p className={['font-helvetica text-[18px] text-[#a8a8a8]', isRtl ? 'font-arabic' : ''].join(' ')}>{role}</p>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-70"
                  >
                    <Linkedin size={16} aria-hidden />
                    {tMember('linkedIn')}
                  </a>
                  <a
                    href="#"
                    className={['flex items-center gap-2 font-helvetica text-[14px] text-white transition-opacity hover:opacity-70', isRtl ? 'font-arabic' : ''].join(' ')}
                  >
                    <Share2 size={16} aria-hidden />
                    {tMember('pressKit')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content: journey + initiatives ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
          {/* Biography card */}
          <div className="relative overflow-hidden bg-card-bg p-8 lg:p-10">
            <span
              className="pointer-events-none absolute -top-4 select-none font-helvetica text-[140px] font-black leading-none text-white/5 lg:text-[160px]"
              style={isRtl ? { left: 24 } : { right: 24 }}
              aria-hidden
            >
              &rdquo;
            </span>
            <h2 className="font-sans text-[12px] font-bold uppercase tracking-[1.5px] text-primary">{tMember('journeyLabel')}</h2>
            <div className="relative mt-6 flex flex-col gap-4">
              <p className={['max-w-3xl font-helvetica text-[16px] leading-[1.6] text-[#d7d7d7]', isRtl ? 'font-arabic' : ''].join(' ')}>
                {tMember(`m${n}Bio1`)}
              </p>
              <p className={['max-w-3xl font-helvetica text-[16px] leading-[1.6] text-[#d7d7d7]', isRtl ? 'font-arabic' : ''].join(' ')}>
                {tMember(`m${n}Bio2`)}
              </p>
            </div>
          </div>

          {/* Initiatives card */}
          <div className="bg-card-bg p-8 lg:p-10">
            <div className={['flex items-center gap-6', isRtl ? 'flex-row-reverse' : ''].join(' ')}>
              <h2 className="shrink-0 font-sans text-[12px] font-bold uppercase tracking-[1.5px] text-primary">
                {tMember('initiativesLabel')}
              </h2>
              <span className="h-px w-full bg-white/10" aria-hidden />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {initiatives.map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <h3 className={['font-helvetica text-[18px] font-bold text-white', isRtl ? 'font-arabic' : ''].join(' ')}>
                    {item.title}
                  </h3>
                  <p className={['font-helvetica text-[14px] leading-[1.5] text-[#a8a8a8]', isRtl ? 'font-arabic' : ''].join(' ')}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
