'use client';

import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';

interface NotFoundPageProps {
  locale: string;
}

const MESSAGE = 'يبدو أنك ضعت في حارات دمشق لكن الأفكار دائماً تجد طريقها..';

export function NotFoundPage({ locale }: NotFoundPageProps) {
  const isRtl = locale === 'ar';

  return (
    <div className="bg-[#101010]" dir={isRtl ? 'rtl' : 'ltr'}>
      <section className="relative h-svh w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/not-found/404.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <Navbar locale={locale} />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-12 text-center sm:pb-16 lg:pb-20">
          <p
            dir="rtl"
            className="max-w-[720px] font-arabic text-base font-normal leading-relaxed text-white sm:text-lg lg:text-[22px] [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]"
          >
            {MESSAGE}
          </p>

          <Link
            href={`/${locale}/home`}
            className={[
              'mt-6 inline-flex h-[52px] items-center justify-center bg-primary px-8',
              'font-helvetica text-[14px] font-medium tracking-[0.46px] text-[#f1f1f1]',
              'transition-opacity hover:opacity-90',
              isRtl ? 'font-arabic' : 'uppercase',
            ].join(' ')}
          >
            {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
