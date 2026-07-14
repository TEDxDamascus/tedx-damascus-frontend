'use client';

import { Navbar } from "../layout";

interface BlogHeroProps {
  locale: string;
  label?: string;
  title?: string;
  meta?: string;
}

export function BlogHero({ locale, label, title, meta }: BlogHeroProps) {
  const isRtl = locale === 'ar';

  return (
    <section className="relative overflow-hidden bg-black pb-12 sm:pb-16 lg:pb-20 h-[370px] font-helvetica">
           {/* Pattern background */}
           <div
             className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden bg-black"
             aria-hidden
           >
             <div className="relative mx-auto aspect-[1440/398] w-full max-h-[min(398px,52vh)] max-w-[1440px]">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                 src="/images/blogs/pattern.svg"
                 alt=""
                 width={1440}
                 height={398}
                 className={[
                   'absolute inset-0 h-[300px] w-full select-none object-cover object-top',
                   isRtl ? 'scale-x-[-1]' : '',
                 ].join(' ')}
                 draggable={false}
               />
             </div>
             <div
               className="pointer-events-none absolute inset-x-0 bottom-0 top-[24%] bg-gradient-to-b from-transparent via-black/55 to-black"
               aria-hidden
             />
           </div>
   
           <div
             className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(220px,38vh)] overflow-hidden md:hidden"
             aria-hidden
           >
               <div className="relative mx-auto h-full max-w-[1440px]">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
               src="/images/blogs/pattern.svg"
                 alt=""
                 width={1440}
                 height={398}
                 className={[
                   'absolute inset-x-0 bottom-0 h-[min(320px,55vh)] w-full select-none object-cover object-bottom',
                   isRtl ? 'scale-x-[-1]' : '',
                 ].join(' ')}
                 draggable={false}
               />
               <div
                 className="pointer-events-none absolute inset-x-0 top-0 h-[65%] bg-gradient-to-b from-black via-black/70 to-transparent"
                 aria-hidden
               />
             </div>
           </div>
   
           <div className="relative z-10">
             <Navbar locale={locale} />
             <div className="mx-auto max-w-[1180px] px-[clamp(1rem,10vw,7.5rem)] pt-32 text-center sm:pt-36 lg:pt-40">
              {label ? (
                <p className="mx-auto mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/80">
                  {label}
                </p>
              ) : null}
               <h1
                 className={[
                   'font-helvetica text-4xl font-normal tracking-tight text-white sm:text-5xl',
                   isRtl ? 'font-arabic' : '',
                 ].join(' ')}
               >
                {title ?? (isRtl ? 'مدونة' : 'Blog')}
               </h1>
              {meta ? (
                <p className="mt-5 text-sm text-white/70 sm:text-base">{meta}</p>
              ) : null}
             </div>
           </div>
         </section>
   
  );
}