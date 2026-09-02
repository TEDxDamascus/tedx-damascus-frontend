'use client';

import Link from 'next/link';

export interface TeamCardProps {
  href: string;
  photo: string;
  name: string;
  role: string;
  category: string;
  isRtl: boolean;
}

export function TeamCard({ href, photo, name, role, category, isRtl }: TeamCardProps) {
  return (
    <Link href={href} className="group relative block" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Corner accent — hidden until hover, mirrors the L-bracket motif used on the member detail hero */}
      <span
        className={[
          'pointer-events-none absolute -top-1 z-10 h-6 w-6 border-t-2 opacity-0 border-primary transition-opacity duration-300 group-hover:opacity-100',
          isRtl ? '-right-1 border-r-2' : '-left-1 border-l-2',
        ].join(' ')}
        aria-hidden
      />

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#101010]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          className="h-full w-full object-cover object-top grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
          <span
            className={[
              'font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-white/60',
              isRtl ? 'font-arabic' : '',
            ].join(' ')}
          >
            {category}
          </span>
        </div>
        <h3
          className={[
            'font-helvetica text-[20px] font-normal leading-[1.2] text-white transition-colors group-hover:text-primary',
            isRtl ? 'font-arabic' : '',
          ].join(' ')}
        >
          {name}
        </h3>
        {role && (
          <p className={['font-helvetica text-[14px] leading-[1.3] text-[#a8a8a8]', isRtl ? 'font-arabic' : ''].join(' ')}>
            {role}
          </p>
        )}
      </div>
    </Link>
  );
}
