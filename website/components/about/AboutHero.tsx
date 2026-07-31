'use client';

import { Navbar } from "../layout";

interface AboutHeroProps {
  locale: string;
  label?: string;
  title?: string;
  meta?: string;
}

export function AboutHero({ locale, label, title, meta }: AboutHeroProps) {
  const isRtl = locale === 'ar';

  return (
    <section className="relative overflow-hidden pb-12 sm:pb-16 lg:pb-20 h-[370px] font-helvetica">
           {/* Pattern background */}
           <div
             className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
             aria-hidden
           >
             <div className="relative mx-auto aspect-[1440/370] w-full h-[370px] max-w-[1440px]">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                 src="/images/blogs/pattern.svg"
                 alt=""
                 width={1440}
                 height={370}
                 className={[
                   'absolute inset-0 h-full w-full select-none object-cover object-center',
                   isRtl ? 'scale-x-[-1]' : '',
                 ].join(' ')}
                 draggable={false}
               />
             </div>
           </div>
   
           <div
             className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[370px] overflow-hidden md:hidden"
             aria-hidden
           >
               <div className="relative mx-auto h-full max-w-[1440px]">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
               src="/images/blogs/pattern.svg"
                 alt=""
                 width={1440}
                 height={370}
                 className={[
                   'absolute inset-x-0 bottom-0 h-full w-full select-none object-cover object-center',
                   isRtl ? 'scale-x-[-1]' : '',
                 ].join(' ')}
                 draggable={false}
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
                {title ? (
                  title.split(' ').map((word: string, index: number) =>
                    word.toUpperCase() === 'US' ? (
                      <span key={index} className="text-[#eb0028]">{word} </span>
                    ) : (
                      <span key={index}>{word} </span>
                    )
                  )
                ) : isRtl ? (
                  'من نحن'
                ) : (
                  <>
                    About <span className="text-[#eb0028]">Us</span>
                  </>
                )}
               </h1>
              {meta ? (
                <p className="mt-5 text-sm text-white/70 sm:text-base">{meta}</p>
              ) : null}
             </div>
           </div>
         </section>
   
  );
}
