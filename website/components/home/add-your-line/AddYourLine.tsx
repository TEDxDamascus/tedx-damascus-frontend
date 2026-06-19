'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { wallApi } from '@/lib/api/client';

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

const MAX_CHARS = 150;

function sanitizeMessage(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\s]/gu, '')
    .slice(0, MAX_CHARS);
}

// Gradient: red is concentrated at the corner closest to the section center.
const ANSWER_CARDS: {
  text: string;
  ltr: { posClass: string; gradient: string };
  rtl: { posClass: string; gradient: string };
}[] = [
  {
    text: 'Kindness in difficult environments is one of the strongest forces in the world.',
    ltr: {
      posClass: 'left-[110px] top-[54px]',
      gradient: 'linear-gradient(to bottom left, #DF2127 0%, #101010 55%)',
    },
    rtl: {
      posClass: 'right-[110px] top-[54px]',
      gradient: 'linear-gradient(to bottom right, #DF2127 0%, #101010 55%)',
    },
  },
  {
    text: "That culture is not something we inherit — it's something we actively shape every day, Beauty still exists, even in the hardest places.",
    ltr: {
      posClass: 'right-[78px] top-[11px]',
      gradient: 'linear-gradient(to bottom right, #DF2127 0%, #101010 55%)',
    },
    rtl: {
      posClass: 'left-[78px] top-[11px]',
      gradient: 'linear-gradient(to bottom left, #DF2127 0%, #101010 55%)',
    },
  },
  {
    text: 'Kindness in difficult environments is one of the strongest forces in the world.',
    ltr: {
      posClass: 'right-[107px] top-[464px]',
      gradient: 'linear-gradient(to right, #101010 40%, #DF2127 100%)',
    },
    rtl: {
      posClass: 'left-[107px] top-[464px]',
      gradient: 'linear-gradient(to left, #101010 40%, #DF2127 100%)',
    },
  },
];

const CARD_INNER_STYLE: React.CSSProperties = {
  background: '#1A1A1A',
  borderRadius: 5,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 16,
  paddingBottom: 16,
  overflow: 'hidden',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const CARD_TEXT_STYLE: React.CSSProperties = {
  width: 225,
  color: 'white',
  fontSize: 14,
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontWeight: 400,
  lineHeight: '20.02px',
  letterSpacing: 0.17,
  wordWrap: 'break-word',
};

const USER_CARD_GRADIENT_LTR = 'linear-gradient(to right, #101010 40%, #FFFFFF 100%)';
const USER_CARD_GRADIENT_RTL = 'linear-gradient(to left,  #101010 40%, #FFFFFF 100%)';

const USER_CARD_INNER_STYLE: React.CSSProperties = {
  background: '#DF2127',
  borderRadius: 5,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 16,
  paddingBottom: 16,
  overflow: 'hidden',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const USER_CARD_TEXT_STYLE: React.CSSProperties = {
  width: 225,
  color: 'black',
  fontSize: 14,
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontWeight: 400,
  lineHeight: '20.02px',
  letterSpacing: 0.17,
  wordWrap: 'break-word',
};

export function AddYourLine({ locale }: AddYourLineProps) {
  const t = useTranslations('AddYourLine');
  const isRtl = locale === 'ar';
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiQuestion, setApiQuestion] = useState<string | null>(null);

  useEffect(() => {
    wallApi.getCurrent()
      .then((data: any) => {
        const q = data?.data?.question ?? data?.question;
        const text = typeof q === 'object' ? (q[locale] ?? q.en ?? q.ar) : (typeof q === 'string' ? q : null);
        if (text) setApiQuestion(text);
      })
      .catch(() => {/* fall back to translation */});
  }, [locale]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(sanitizeMessage(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = message.trim();
    if (!clean || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await wallApi.submitAnswer(clean);
    } catch {
      // show the card locally even if the API call fails
    } finally {
      setSubmittedMessage(clean);
      setSubmitted(true);
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="relative bg-page-bg overflow-hidden flex flex-col items-center justify-center pt-20 pb-16 lg:py-0 lg:h-[595px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >      <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden>
        {ANSWER_CARDS.map((card, i) => {
          const { posClass, gradient } = isRtl ? card.rtl : card.ltr;
          return (
            <div
              key={i}
              className={`absolute ${posClass}`}
              style={{ padding: 1, borderRadius: 6, background: gradient, display: 'inline-flex' }}
            >
              <div style={CARD_INNER_STYLE}>
                <p style={CARD_TEXT_STYLE}>{card.text}</p>
              </div>
            </div>
          );
        })}
        {submitted && submittedMessage && (
          <motion.div
            className={`absolute ${isRtl ? 'right-[77px]' : 'left-[77px]'} top-[404px]`}
            style={{ padding: 1, borderRadius: 6, background: isRtl ? USER_CARD_GRADIENT_RTL : USER_CARD_GRADIENT_LTR, display: 'inline-flex' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div style={USER_CARD_INNER_STYLE}>
              <p style={USER_CARD_TEXT_STYLE}>{submittedMessage}</p>
            </div>
          </motion.div>
        )}
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
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
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
              'font-helvetica',
            ].join(' ')}
          >
            {apiQuestion ?? t('question')}<span className="text-primary"> ?</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className={[
              'relative z-10 flex items-end gap-[9px]',
              'lg:absolute lg:top-[190px] lg:left-1/2 lg:-translate-x-1/2',
            ].join(' ')}
          >
            <div className={`flex flex-col gap-[6px] w-[240px] sm:w-[300px] lg:w-[360px] ${isRtl ? 'items-end' : 'items-start'}`}>
              {!submitted && (
                <input
                  type="text"
                  value={message}
                  onChange={handleChange}
                  placeholder={t('inputPlaceholder')}
                  maxLength={MAX_CHARS}
                  autoComplete="off"
                  className={[
                    'bg-transparent border-0 border-b border-white text-white pb-1',
                    'outline-none focus:outline-none focus-visible:outline-none',
                    'focus:ring-0 focus:ring-offset-0 focus:border-white',
                    'text-[20px] font-medium leading-[1.2] tracking-[0.15px]',
                    'placeholder:text-white/60 w-full',
                    'font-helvetica',
                  ].join(' ')}
                />
              )}
            </div>
            {!submitted && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white text-base leading-6 tracking-[0.15px] px-6 py-3 whitespace-nowrap hover:bg-card-bg transition-colors shrink-0 font-helvetica disabled:opacity-50"
              >
                {isSubmitting ? '…' : t('submit')}
              </button>
            )}
          </form>
        </div>
      </motion.div>

      {submitted && submittedMessage && (
        <motion.div
          className="lg:hidden inline-flex relative z-10 mt-6"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          style={{ transformOrigin: 'top', padding: 1, borderRadius: 6, background: isRtl ? USER_CARD_GRADIENT_RTL : USER_CARD_GRADIENT_LTR }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ ...USER_CARD_INNER_STYLE, minWidth: 200, justifyContent: 'center' }}>
            <p style={{ ...USER_CARD_TEXT_STYLE, width: 'auto', maxWidth: 225, textAlign: 'center' }}>{submittedMessage}</p>
          </div>
        </motion.div>
      )}

    </section>
  );
}
