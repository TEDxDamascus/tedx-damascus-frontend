'use client';

import { motion } from 'framer-motion';

export function FinalReveal() {
  return (
    <motion.div
      className="text-center mb-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl mb-8 font-helvetica"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white font-bold">Damascus</span>
        <motion.span
          className="text-tedx-red text-4xl md:text-6xl lg:text-7xl align-super inline-block mx-2 font-extrabold"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          x
        </motion.span>
        <motion.span
          className="text-tedx-red inline-block font-extrabold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          TED
        </motion.span>
      </motion.h1>

      <motion.h2
        className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 font-alamani font-normal"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        قريباً
      </motion.h2>

      <motion.div
        className="mt-8 h-1.5 w-40 bg-gradient-to-r from-transparent via-tedx-red to-transparent mx-auto"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
