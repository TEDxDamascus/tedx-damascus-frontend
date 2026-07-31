'use client';

import React from 'react';
import CountUp from 'react-countup';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  labelKey: string;
}

interface StatsSectionProps {
  locale: string;
}

// Reusable Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const viewportConfig = {
  once: true,
  amount: 0.3,
};

export default function StatsSection({ locale }: StatsSectionProps) {
  const t = useTranslations('StatsSection');
  const isRtl = locale === 'ar';

  const stats: StatItem[] = [
    { value: 100, prefix: '+', labelKey: 'volunteers' },
    { value: 30, prefix: '+', labelKey: 'speakers' },
    { value: 6, prefix: '+', labelKey: 'events' },
    { value: 10, prefix: '+', suffix: 'K', labelKey: 'followers' },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-4 mb-[64px]">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-6 sm:gap-8 lg:gap-[38px]"
        dir={isRtl ? 'rtl' : 'ltr'}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.labelKey}
            className="w-full max-w-[251.5px] flex items-baseline gap-2 min-h-[72px]"
            variants={fadeInUp}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
          >
            <span className="flex items-end text-[60px] text-[#eb0028] leading-none">
              
              {stat.prefix && (
                <span className="self-end text-[60px] leading-none translate-y-[4px] mr-1">
                  {stat.prefix}
                </span>
              )}
              
              <CountUp
                end={stat.value}
                duration={2}
                enableScrollSpy
                scrollSpyOnce
              />
              
              {stat.suffix && (
                <span className="text-[60px] leading-none">{stat.suffix}</span>
              )}
            </span>

            <span className="text-[24px] font-medium text-white">
              {t(stat.labelKey)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}