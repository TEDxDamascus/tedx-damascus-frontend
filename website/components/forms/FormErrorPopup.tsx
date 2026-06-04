'use client';

import { useRouter } from 'next/navigation';

const STRINGS = {
  en: {
    vpnTip: 'Make sure you are not connected to any VPN.',
    supportTip: 'If you still have the problem, please call the support.',
    refresh: 'Disconnect VPN & Refresh',
    goHome: 'Go Back Home',
  },
  ar: {
    vpnTip: 'تأكد من أنك لست متصلاً بأي VPN.',
    supportTip: 'إذا استمرت المشكلة، يرجى التواصل مع الدعم.',
    refresh: 'قطع VPN وتحديث الصفحة',
    goHome: 'العودة إلى الرئيسية',
  },
} as const;

interface FormErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  locale: string;
}

export function FormErrorPopup({ isOpen, onClose, message, locale }: FormErrorPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const s = locale === 'ar' ? STRINGS.ar : STRINGS.en;
  const isRtl = locale === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#111] border border-[#2a2a2a] w-full max-w-[440px] p-8 flex flex-col gap-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Error icon + message */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#eb0028]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="font-helvetica text-white text-base leading-snug pt-1">{message}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#222]" />

        {/* VPN tip */}
        <div className="flex items-start gap-3">
          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="font-helvetica text-[#bebebe] text-sm leading-relaxed">{s.vpnTip}</p>
        </div>

        {/* Support tip */}
        <div className="flex items-start gap-3">
          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <p className="font-helvetica text-[#bebebe] text-sm leading-relaxed">{s.supportTip}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-4 py-2.5 hover:bg-[#eb0028]/10 transition-colors text-center"
          >
            {s.refresh}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/home`)}
            className="flex-1 border border-[#444] text-[#bebebe] font-helvetica text-sm uppercase tracking-wider px-4 py-2.5 hover:bg-white/5 transition-colors text-center"
          >
            {s.goHome}
          </button>
        </div>
      </div>
    </div>
  );
}

const VPN_BANNER = {
  en: 'Note: Make sure you are not connected to any VPN to ensure the form loads and submits correctly.',
  ar: 'تنبيه: تأكد من أنك غير متصل بأي VPN لضمان تحميل النموذج وإرساله بشكل صحيح.',
};

export function VpnWarningBanner({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const text = locale === 'ar' ? VPN_BANNER.ar : VPN_BANNER.en;

  return (
    <div
      className="flex items-start gap-3 bg-[#eb0028]/10 border border-[#eb0028]/25 px-5 py-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <svg className="flex-shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <p className="font-helvetica text-[#bebebe] text-sm leading-relaxed">{text}</p>
    </div>
  );
}
