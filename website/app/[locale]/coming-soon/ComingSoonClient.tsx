'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ImageGrid,
    TypewriterText,
    EmailSubscription,
    SocialIcons,
} from '@/lib/components/coming-soon';

export default function ComingSoonClient() {
    const [showFinalText, setShowFinalText] = useState(false);

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden" dir="rtl">
            <ImageGrid />

            <motion.header
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <SocialIcons />


                <motion.div
                    className="flex items-baseline gap-0 font-helvetica"
                    dir="ltr"
                    whileHover={{ scale: 1.05 }}
                >
                    <span className="text-tedx-red font-extrabold text-4xl sm:text-5xl">TED</span>
                    <span className="text-tedx-red font-extrabold text-xl sm:text-2xl relative -top-3 sm:-top-4">x</span>
                    <span className="text-white font-bold text-3xl sm:text-4xl ml-1">Damascus</span>
                </motion.div>
            </motion.header>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">

                {!showFinalText && (
                    <TypewriterText onComplete={() => setShowFinalText(true)} />
                )}

                {showFinalText && (
                    <div className="text-center">
                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl text-white font-alamani font-normal mb-20"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            قريباً
                        </motion.h2>

                        <motion.div
                            className="h-1.5 w-40 bg-gradient-to-r from-transparent via-tedx-red to-transparent mx-auto mb-20"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <EmailSubscription />
                    </div>
                )}
            </div>
        </div>
    );
}
