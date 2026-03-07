'use client';

import { motion } from 'framer-motion';
import { Linkedin, Facebook, Instagram } from 'lucide-react';

export function SocialIcons() {
  return (
    <div className="flex gap-2 sm:gap-3">
      <motion.a
        href="https://www.linkedin.com/company/tedxdamascus"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white transition-all duration-300"
        whileHover={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 8px rgba(226, 30, 44, 0.8))'
        }}
        whileTap={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 12px rgba(226, 30, 44, 1))'
        }}
      >
        <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </motion.a>
      <motion.a
        href="https://www.facebook.com/tedxdamascus"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white transition-all duration-300"
        whileHover={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 8px rgba(226, 30, 44, 0.8))'
        }}
        whileTap={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 12px rgba(226, 30, 44, 1))'
        }}
      >
        <Facebook className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </motion.a>
      <motion.a
        href="https://www.instagram.com/tedxdamascus"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white transition-all duration-300"
        whileHover={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 8px rgba(226, 30, 44, 0.8))'
        }}
        whileTap={{
          color: '#E21E2C',
          filter: 'drop-shadow(0 0 12px rgba(226, 30, 44, 1))'
        }}
      >
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </motion.a>
    </div>
  );
}
