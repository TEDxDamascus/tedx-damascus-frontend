'use client';

import Link from 'next/link';

export default function ComingSoonClient({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#101010] px-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Red top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      {/* TEDxDamascus wordmark */}
      <div className="mb-8 font-helvetica" dir="ltr">
        <span className="text-primary font-extrabold text-[40px] leading-none">TED</span>
        <span className="relative -top-3 text-primary font-extrabold text-[22px]">x</span>
        <span className="ml-1 text-white font-bold text-[36px] leading-none">Damascus</span>
      </div>

      {/* Divider */}
      <div className="mb-8 h-px w-16 bg-primary" />

      {/* Main text */}
      <h1 className="text-center font-helvetica font-bold uppercase text-white tracking-[-1px] text-[56px] leading-none sm:text-[80px] lg:text-[100px]">
        {isRtl ? 'قريباً' : 'COMING SOON'}
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-[420px] text-center font-sans text-[16px] leading-relaxed text-[#a8a8a8]">
        {isRtl
          ? 'هذه الصفحة قيد التطوير. ترقبوا المزيد من التحديثات.'
          : 'This page is under construction. Stay tuned for updates.'}
      </p>

      {/* Back home */}
      <Link
        href={`/${locale}/home`}
        className="mt-12 inline-flex h-[52px] items-center px-8 bg-primary font-helvetica text-[14px] font-medium uppercase tracking-[0.46px] text-white transition-opacity hover:opacity-90"
      >
        {isRtl ? 'العودة إلى الرئيسية' : 'BACK TO HOME'}
      </Link>
    </div>
  );
}
