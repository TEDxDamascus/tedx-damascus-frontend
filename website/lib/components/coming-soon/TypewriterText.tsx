'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const fullText = 'قصة عمرها آلاف السنين… تحتاج لمن يرويها الآن';
const pausePoint = 'تحتاج لمن يرويها الآن';

interface TypewriterTextProps {
  onComplete: () => void;
}

export function TypewriterText({ onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isComplete) {
      onComplete();
      return;
    }

    if (displayedText === pausePoint && !isPaused) {
      setIsPaused(true);
      return;
    }

    if (isPaused) return;

    if (displayedText === fullText) {
      const timeout = setTimeout(() => {
        setIsComplete(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setDisplayedText(fullText.substring(0, displayedText.length + 1));
    }, 150);

    return () => clearTimeout(timeout);
  }, [displayedText, isComplete, isPaused, onComplete]);

  if (isComplete) return null;

  return (
    <motion.div
      className="text-center mb-8 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-2xl md:text-3xl lg:text-4xl text-white min-h-[4rem] flex items-center justify-center md:whitespace-nowrap font-alamani font-normal leading-relaxed">
        {displayedText}
        <motion.span
          className="inline-block w-1 h-8 md:h-10 lg:h-12 bg-tedx-red mr-2"
          animate={{
            opacity: [1, 0, 1],
            scaleY: [1, 0.8, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </p>
    </motion.div>
  );
}
