'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface AddYourLineProps {
  locale: string;
}

const VIEWPORT = { once: true, margin: '-50px' as const };
const Q_MARKS = [
  { left: 98.23,  top: 42.24,  size: 83.265,  rotation: -25.9  },
  { left: 351.9,  top: 115.67, size: 83.265,  rotation: -25.9  },
  { left: 124.93, top: 144.28, size: 83.265,  rotation: -25.9  },
  { left: 16.38,  top: 145.91, size: 83.265,  rotation: 30.75  },
  { left: 0.03,   top: 87.04,  size: 63.352,  rotation: -99.04 },
  { left: 191.69, top: 32.42,  size: 69.385,  rotation: 3.81   },
  { left: 39.1,   top: 7.75,   size: 60.658,  rotation: -25.9  },
  { left: 469.36, top: 96.32,  size: 83.265,  rotation: 30.75  },
  { left: 393.69, top: 19.18,  size: 83.265,  rotation: 6.81   },
  { left: 495.9,  top: 19.18,  size: 61.874,  rotation: -25.9  },
  { left: 98.23,  top: 228.98, size: 61.874,  rotation: -25.9  },
  { left: 229.22, top: 0,      size: 121.437, rotation: 49.14  },
  { left: 224.81, top: 119.47, size: 83.265,  rotation: 145.24 },
  { left: 237.77, top: 214.41, size: 60.658,  rotation: 32.71  },
  { left: 341.71, top: 226.02, size: 83.265,  rotation: 71.97  },
  { left: 459.66, top: 173.4,  size: 121.437, rotation: -25.02 },
] as const;

const ANSWER_CARDS: { text: string; posClass: string; isUser?: boolean }[] = [
  {
    text: 'Kindness in difficult environments is one of the strongest forces in the world.',
    posClass: 'left-[110px] top-[53px]',
  },
  {
    text: "That culture is not something we inherit — it's something we actively shape every day.",
    posClass: 'right-[78px] top-[11px]',
  },
  {
    text: "That culture is not something we inherit — it's something we actively shape every day.",
    posClass: 'left-[77px] top-[404px]',
    isUser: true,
  },
  {
    text: 'Kindness in difficult environments is one of the strongest forces in the world.',
    posClass: 'right-[107px] top-[464px]',
  },
];

export function AddYourLine({ locale }: AddYourLineProps) {
  const t = useTranslations('AddYourLine');
  const isRtl = locale === 'ar';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section
      className="relative bg-page-bg overflow-hidden flex flex-col items-center justify-center py-16 lg:py-0 lg:h-[595px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >      <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden>
        {ANSWER_CARDS.map((card, i) => (
          <div
            key={i}
            className={[
              'absolute flex items-center justify-center px-6 py-4 rounded-[6px]',
              card.isUser
                ? 'bg-[#df2127] border border-white'
                : 'bg-[#1a1a1a] border border-[#df2127]',
              card.posClass,
            ].join(' ')}
          >
            <p className={`w-[225px] font-helvetica text-[14px] leading-[1.43] tracking-[0.17px] ${card.isUser ? 'text-black' : 'text-white'}`}>
              {card.text}
            </p>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-[90vw] max-w-[582px] lg:w-[692px] lg:max-w-[692px] lg:h-[419px]"
      >        <div
          className="hidden lg:block absolute pointer-events-none left-[599.85px] top-0 w-[92.139px] h-[96.319px]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/add-your-line/triangle.svg" alt="" className="block w-full h-full" draggable={false} loading="lazy" />
        </div>
        <div
          className="hidden lg:block absolute pointer-events-none left-0 top-[224.11px] w-[199.971px] h-[194.545px]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/add-your-line/rectangle.svg" alt="" className="block w-full h-full" draggable={false} loading="lazy" />
        </div>
        <div
          className={[
            'relative bg-[#151515] shadow-[3.815px_2.861px_1.907px_rgba(0,0,0,0.3)] overflow-hidden',
            'flex flex-col items-center justify-center gap-8 px-8 py-10',
            'lg:absolute lg:left-[64px] lg:top-[38px] lg:w-[582px] lg:h-[300px] lg:p-0',
          ].join(' ')}
        >
          <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
            {Q_MARKS.map((m, i) => (
              <div key={i} className="absolute" style={{ left: m.left, top: m.top }}>
                <span
                  className="text-white block whitespace-nowrap leading-normal opacity-[0.07] font-arial-rounded [text-shadow:0.954px_2.861px_3.624px_black]"
                  style={{ fontSize: m.size, transform: `rotate(${m.rotation}deg)` }}
                >
                  ?
                </span>
              </div>
            ))}
          </div>
          <h2
            className={[
              'relative z-10 text-white font-medium leading-[1.235] tracking-[0.25px] text-center',
              'text-[26px] sm:text-[30px]',
              'lg:absolute lg:text-[34px] lg:w-[573px]',
              'lg:left-1/2 lg:-translate-x-1/2',
              'lg:top-[calc(50%-50.31px)] lg:-translate-y-1/2',
              isRtl ? 'font-arabic' : 'font-helvetica',
            ].join(' ')}
          >
            {t('question')}<span className="text-primary"> ?</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className={[
              'relative z-10 flex items-end gap-[9px]',
              'lg:absolute lg:top-[190px] lg:left-1/2 lg:-translate-x-1/2',
              isRtl ? 'flex-row-reverse' : '',
            ].join(' ')}
          >
            <div className={`flex flex-col gap-[6px] w-[240px] sm:w-[300px] lg:w-[360px] ${isRtl ? 'items-end' : 'items-start'}`}>
              {submitted ? (
                <p className={`text-white text-[18px] lg:text-[20px] font-medium leading-[1.2] tracking-[0.15px] ${isRtl ? 'font-arabic' : 'font-helvetica'}`}>
                  {t('submitted')}
                </p>
              ) : (
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className={[
                    'bg-transparent border-0 border-b border-white text-white pb-1 outline-none focus:ring-0 focus:ring-offset-0',
                    'text-[18px] lg:text-[20px] font-medium leading-[1.2] tracking-[0.15px]',
                    'placeholder:text-white/60 w-full',
                    isRtl ? 'font-arabic text-right' : 'font-helvetica',
                  ].join(' ')}
                />
              )}
            </div>
            {!submitted && (
              <button
                type="submit"
                className={`bg-black text-white text-base leading-6 tracking-[0.15px] px-6 py-3 whitespace-nowrap hover:bg-card-bg transition-colors shrink-0 ${isRtl ? 'font-arabic' : 'font-helvetica'}`}
              >
                {t('submit')}
              </button>
            )}
          </form>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        className="relative z-10 mt-8 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:mt-0"
      >
        <Link
          href={`/${locale}/answers`}
          className={[
            'flex items-center gap-2 text-primary text-base leading-6 tracking-[0.15px]',
            'hover:gap-3 transition-all duration-200 group',
            isRtl ? 'flex-row-reverse font-arabic' : 'font-helvetica',
          ].join(' ')}
        >
          {t('viewAll')}
          <ArrowRight
            size={20}
            strokeWidth={1.75}
            className="shrink-0 group-hover:translate-x-0.5 transition-transform"
            aria-hidden
          />
        </Link>
      </motion.div>
    </section>
  );
}
