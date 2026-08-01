'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface AboutContentProps {
  locale: string;
}

// Reusable Framer Motion variants
const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const viewportConfig = {
  once: true,
  amount: 0.3,
};

// Reusable title component with TED/TEDx highlighting
const Title = ({ title }: { title: string }) => {
  return (
    <>
      {title.split(' ').map((word: string, index: number) => 
        word.toLowerCase() === 'tedx' || word.toLowerCase() === 'ted' ? (
          <span key={index} className="text-[#eb0028]">{word} </span>
        ) : (
          <span key={index}>{word} </span>
        )
      )}
    </>
  );
};

export function AboutContent({ locale }: AboutContentProps) {
  const t = useTranslations('AboutPage');
  const isRtl = locale === 'ar';

  return (
    <main className="w-full bg-[#101010]">
      <div className="mx-auto max-w-[1120px] px-4 py-16">
        {/* Section 1 - About TEDxDamascus */}
        <section className="mb-[64px] grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[48px]">
          <motion.div
            className="order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInLeft}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="mb-[20px] text-[24px] font-bold text-[#F1F1F1] font-helvetica">
              <Title title={t('tedxDamascus.title')} />
            </h2>
            <p className="leading-relaxed text-[#a8a8a8] max-w-[536px] text-base font-helvetica">
              {t('tedxDamascus.description')}
            </p>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInRight}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="max-h-[360px] max-w-[536px] overflow-hidden rounded-2xl w-full">
              <img
                src="/images/about/About TEDxDamascus.png"
                alt={t('tedxDamascus.imageAlt')}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Section 2 - About TED */}
        <section className="mb-[64px] grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[48px]">
          <motion.div
            className={isRtl ? 'order-2' : 'order-1'}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={isRtl ? fadeInRight : fadeInLeft}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="max-h-[432px] max-w-[548px] overflow-hidden rounded-[8px] w-full">
              <img
                src="/images/about/About TED.png"
                alt={t('ted.imageAlt')}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            className={isRtl ? 'order-1' : 'order-2'}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={isRtl ? fadeInLeft : fadeInRight}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <h2 className="mb-[20px] font-bold text-white text-[24px] font-helvetica">
              <Title title={t('ted.title')} />
            </h2>
            <p className="leading-relaxed text-[#a8a8a8] text-[16px] max-w-[548px] font-helvetica">
              {t('ted.description')}
            </p>
          </motion.div>
        </section>

        {/* Section 3 - About TEDx */}
        <section className="mb-[64px] grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[48px]">
          <motion.div
            className="order-2 lg:order-1 max-w-[536px]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInLeft}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="mb-6 text-[24px] font-bold text-white lg:text-[24px] font-helvetica">
              <Title title={t('tedx.title')} />
            </h2>
            <p className="leading-relaxed text-[#a8a8a8] text-base font-helvetica">
              {t('tedx.description')}
            </p>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2 max-w-[536px]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInRight}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="h-[272px] max-w-[536px] overflow-hidden rounded-2xl w-full">
              <img
                src="/images/about/About TEDx.png"
                alt={t('tedx.imageAlt')}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
