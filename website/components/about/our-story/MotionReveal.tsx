'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Horizontal offset (px) to animate in from — e.g. -40 slides in from the left toward center. Omit for the default upward fade. */
  x?: number;
}

const VIEWPORT = { once: true, margin: '-60px' as const };

export function MotionReveal({ children, delay = 0, className, x }: MotionRevealProps) {
  return (
    <motion.div
      initial={x === undefined ? { opacity: 0, y: 24 } : { opacity: 0, x }}
      whileInView={x === undefined ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
