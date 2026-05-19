'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const VIEWPORT = { once: true, margin: '-60px' as const };

export function MotionReveal({ children, delay = 0, className }: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
