'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface LeaveGuardDialogProps {
  isDirty: boolean;
  locale: string;
}

export function LeaveGuardDialog({ isDirty, locale }: LeaveGuardDialogProps) {
  const t = useTranslations('Forms');
  const [showDialog, setShowDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isRtl = locale === 'ar';
  // When the user confirms leave we flip this so the beforeunload guard skips
  const allowLeaveRef = useRef(false);

  // Prevent browser reload / tab close
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Intercept in-app <Link> and <a> navigation
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      // Skip external, hash-only, and same-page links
      if (href.startsWith('http') || href.startsWith('#') || href === '') return;
      if (anchor.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      setPendingHref(anchor.href);
      setShowDialog(true);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [isDirty]);

  const confirmLeave = useCallback(() => {
    allowLeaveRef.current = true;  // suppress beforeunload for this navigation
    setShowDialog(false);
    if (pendingHref) window.location.href = pendingHref;
  }, [pendingHref]);

  const cancelLeave = useCallback(() => {
    setShowDialog(false);
    setPendingHref(null);
  }, []);

  return (
    <AnimatePresence>
      {showDialog && (
        <motion.div
          key="leave-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
          onClick={cancelLeave}
        >
          <motion.div
            key="leave-panel"
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#0d0d0d] text-white max-w-sm w-full px-8 py-10 text-center border border-[#EB0028]/25"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning icon */}
            <div className="w-16 h-16 rounded-full bg-[#EB0028]/15 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EB0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <circle cx="12" cy="17" r="1" fill="#EB0028" stroke="none"/>
              </svg>
            </div>
            <h2 className="font-helvetica text-xl font-bold leading-tight mb-3">
              {t('leaveDialogTitle')}
            </h2>
            <div className="w-8 h-px bg-[#EB0028] mx-auto my-4" />
            <p className="font-helvetica text-sm leading-6 text-white/70 mb-8">
              {t('leaveDialogMessage')}
            </p>
            <div className={`flex gap-3 justify-center ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={cancelLeave}
                className="font-helvetica border border-[#EB0028] text-[#EB0028] px-6 py-3 text-sm font-bold tracking-[0.5px] uppercase hover:bg-[#EB0028]/10 transition-colors"
              >
                {t('leaveDialogStay')}
              </button>
              <button
                onClick={confirmLeave}
                className="font-helvetica bg-[#EB0028] text-white px-6 py-3 text-sm font-bold tracking-[0.5px] uppercase hover:bg-[#EB0028]/90 transition-colors"
              >
                {t('leaveDialogLeave')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
