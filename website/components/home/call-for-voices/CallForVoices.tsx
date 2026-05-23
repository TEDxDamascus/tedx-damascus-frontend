import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { BlurText } from './BlurText';

interface CallForVoicesProps {
  locale: string;
}

function CardShapes() {
  return (
    <>
      <div
        className="absolute pointer-events-none left-[357.99px] -top-[3.24px] w-[99.57px] h-[103.97px]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/add-your-line/triangle.svg" alt="" className="w-full h-full" draggable={false} loading="lazy" />
      </div>
      <div
        className="absolute pointer-events-none -left-[5.28px] top-[88.63px] w-[204.73px] h-[198.03px]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/add-your-line/rectangle.svg" alt="" className="w-full h-full" draggable={false} loading="lazy" />
      </div>
    </>
  );
}
function VoiceCard({ ghostIcon, children }: { ghostIcon: string; children: ReactNode }) {
  return (
    <div className="relative w-[498.6px] h-[311.96px]">
      <CardShapes />
      <div className="absolute w-[340px] h-[200px] left-[57px] top-[33px] px-[42px] py-[36px] bg-card-bg overflow-hidden flex flex-col justify-between items-start shadow-[1.724px_1.724px_4.311px_0.862px_rgba(0,0,0,0.50)]">
        <div aria-hidden className="absolute right-0 top-1/2 -translate-y-1/2 w-[190px] h-[190px] opacity-[0.35]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ghostIcon} alt="" className="w-full h-full" draggable={false} loading="lazy" />
        </div>
        {children}
      </div>
    </div>
  );
}

export async function CallForVoices({ locale }: CallForVoicesProps) {
  const t = await getTranslations('CallForVoices');

  return (
    <section className="w-full px-[140px] pb-[60px] overflow-hidden flex flex-col justify-center items-center bg-page-bg">
      <div className="relative w-[1142.93px] h-[404.39px] -mb-24">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 py-12 flex items-center gap-[37px]">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/call-for-voices/group-right.png"
            alt="" aria-hidden draggable={false} loading="lazy"
            className="w-[320px] h-auto shrink-0 object-contain"
          />

          <BlurText
            text={t('title')}
            delay={120}
            direction="top"
            className="justify-center shrink-0 text-white text-[48px] font-helvetica font-normal leading-[72px] break-words"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/call-for-voices/group-left.png"
            alt="" aria-hidden draggable={false} loading="lazy"
            className="w-[320px] h-auto shrink-0 object-contain"
          />
        </div>
      </div>
      <div className="px-[21px] flex justify-center items-center gap-8">

        <VoiceCard ghostIcon="/images/call-for-voices/user.svg">
          <div className="relative z-10 self-stretch flex flex-col justify-center items-start gap-8">
            <p className="self-stretch text-white text-2xl font-helvetica font-bold leading-[32.02px] break-words">
              {t('nominateLine1')}<br />{t('nominateLine2')}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/${locale}/speakers`}
                className="whitespace-nowrap text-primary text-base font-helvetica leading-6 tracking-[0.15px]"
              >
                {t('nominateCta')}
              </Link>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/call-for-voices/arrow-right.png" alt="" aria-hidden draggable={false} loading="lazy" className="w-3 h-[18px] shrink-0" />
            </div>
          </div>
        </VoiceCard>

        <VoiceCard ghostIcon="/images/call-for-voices/podcast.svg">
          <div className="relative z-10 self-stretch flex flex-col justify-center items-start gap-8">
            <p className="self-stretch text-white text-2xl font-helvetica font-bold leading-[32.02px] break-words">
              {t('applyLine1')}<br />{t('applyLine2')}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/${locale}/volunteer`}
                className="whitespace-nowrap text-primary text-base font-helvetica leading-6 tracking-[0.15px]"
              >
                {t('applyCta')}
              </Link>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/call-for-voices/arrow-right.png" alt="" aria-hidden draggable={false} loading="lazy" className="w-3 h-[18px] shrink-0" />
            </div>
          </div>
        </VoiceCard>

      </div>
    </section>
  );
}
