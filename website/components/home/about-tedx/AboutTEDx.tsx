import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MotionReveal } from './MotionReveal';

interface AboutTEDxProps {
  locale: string;
}

export async function AboutTEDx({ locale }: AboutTEDxProps) {
  setRequestLocale(locale);
  const t     = await getTranslations('AboutTEDx');
  const isRtl = locale === 'ar';

  return (
    <section
      className="relative bg-page-bg overflow-hidden"
      aria-labelledby="about-tedx-heading"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/pattern.svg"
          alt=""
          className="w-full h-full object-cover object-center"
          draggable={false}
          loading="lazy"
        />
      </div>
      <div
        className="absolute inset-x-0 top-0 h-2/5 pointer-events-none bg-[linear-gradient(to_bottom,#101010_0%,rgba(16,16,16,0.6)_55%,transparent_100%)]"
        aria-hidden
      />
      <div
        className={[
          'relative z-10 max-w-[1440px] mx-auto',
          'px-6 sm:px-12 lg:px-[82px]',
          'py-16 lg:py-[130px]',
          'flex flex-col lg:flex-row items-start lg:items-center',
          'gap-10 lg:gap-[76px]',
          '',
        ].join(' ')}
      >
        <div className="flex flex-col shrink-0 w-full lg:w-[331px]">
          <MotionReveal>
            <h2
              id="about-tedx-heading"
              className={[
                'text-[60px] font-light',
                'text-white leading-[1.2] tracking-[-0.5px]',
                'mb-[-30px]',
                isRtl ? 'font-arabic text-right' : 'font-helvetica',
              ].join(' ')}
            >
              {t('title')}
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.15}>
            <div className="relative w-full aspect-[322/194]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/tedx-logo.png"
                alt="TEDx"
                className={`w-full h-full object-contain ${isRtl ? 'object-right' : 'object-left'}`}
                loading="lazy"
              />
            </div>
          </MotionReveal>
        </div>
        <MotionReveal
          delay={0.28}
          className={[
            isRtl ? 'font-arabic' : 'font-helvetica',
            'text-base font-normal text-white leading-[24px] tracking-[0.15px]',
            'flex-1',
          ].join(' ')}
        >
          <p>{t('description')}</p>
        </MotionReveal>
      </div>
    </section>
  );
}
