'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { newsletterApi } from '@/lib/api/client';

export function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError('');

    try {
      await newsletterApi.subscribe(email);
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Subscribe Error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ، يرجى المحاولة مرة أخرى');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl px-4 sm:px-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >

      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className="relative"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="انضم لقائمتنا البريدية"
            required
            disabled={loading}
            className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white/5 backdrop-blur-xl border-2 border-white/20
              rounded-full text-white placeholder-gray-500 placeholder:text-xs sm:placeholder:text-sm text-sm sm:text-base md:text-lg text-center
              focus:outline-none focus:border-tedx-red focus:bg-white/10
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 font-alamani font-normal"
            dir="rtl"
          />

          <button
            type="submit"
            disabled={loading}
            className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 bg-tedx-red hover:bg-[#c01824]
              text-white p-2 sm:p-3 rounded-full transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-2 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 -rotate-[100deg]" />
            )}
          </button>
        </motion.div>

        {submitted && (
          <motion.p
            className="text-center text-tedx-red mt-6 text-xl font-alamani font-normal"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            شكراً لك! سنتواصل معك قريباً ✓
          </motion.p>
        )}

        {error && (
          <motion.p
            className="text-center text-red-400 mt-6 text-lg font-alamani font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}
