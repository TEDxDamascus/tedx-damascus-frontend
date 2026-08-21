'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

function buildShareLinks(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}

function canUseNativeShare() {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }
  // Desktop share sheets are inconsistent; keep the custom popup there.
  return window.matchMedia('(pointer: coarse)').matches;
}

interface PressKitShareButtonProps {
  name: string;
  isRtl?: boolean;
  label?: string;
  className?: string;
  children: ReactNode;
}

export function PressKitShareButton({
  name,
  isRtl = false,
  label,
  className,
  children,
}: PressKitShareButtonProps) {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const shareMessage = isRtl
    ? `تعرّف على ${name} في TEDx Damascus`
    : `Check out ${name} at TEDx Damascus`;

  const labels = {
    share: label ?? (isRtl ? 'مشاركة' : 'PRESS KIT'),
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    copyLink: isRtl ? 'نسخ الرابط' : 'Copy Link',
    copied: isRtl ? 'تم النسخ!' : 'Copied!',
    shareVia: isRtl ? 'مشاركة عبر' : 'Share via',
  };

  useEffect(() => {
    if (!showSharePopup) return;

    function placePopup() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const width = 220;
      const gap = 12;
      const left = isRtl
        ? Math.max(8, rect.right - width)
        : Math.min(rect.left, window.innerWidth - width - 8);
      const below = rect.bottom + gap;
      const estimatedHeight = 220;
      const top =
        below + estimatedHeight > window.innerHeight
          ? Math.max(8, rect.top - estimatedHeight - gap)
          : below;

      setPopupPos({ top, left });
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowSharePopup(false);
    }

    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popupRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setShowSharePopup(false);
    }

    placePopup();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('resize', placePopup);
    window.addEventListener('scroll', placePopup, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('resize', placePopup);
      window.removeEventListener('scroll', placePopup, true);
    };
  }, [showSharePopup, isRtl]);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title || name;

    if (canUseNativeShare()) {
      try {
        await navigator.share({ title, text: shareMessage, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }

    setShowSharePopup((open) => !open);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — no-op
    }
  }

  const shareLinks =
    typeof window === 'undefined'
      ? { whatsapp: '#', linkedin: '#', facebook: '#' }
      : buildShareLinks(window.location.href, shareMessage);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleShare}
        className={className}
        aria-haspopup="dialog"
        aria-expanded={showSharePopup}
      >
        {children}
        <span>{labels.share}</span>
      </button>

      {typeof document !== 'undefined' &&
        showSharePopup &&
        createPortal(
          <div
            ref={popupRef}
            role="dialog"
            aria-label={labels.shareVia}
            style={{ top: popupPos.top, left: popupPos.left }}
            className="fixed z-[80] min-w-[220px] rounded-lg border border-white/10 bg-[#1a1a1a] p-3 shadow-xl"
          >
            <p
              className={[
                'mb-2 px-2 text-xs font-bold uppercase tracking-wider text-white/40',
                isRtl ? 'font-arabic normal-case tracking-normal text-end' : 'font-sans',
              ].join(' ')}
            >
              {labels.shareVia}
            </p>
            <div className="flex flex-col gap-0.5">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setShowSharePopup(false)}
              >
                {labels.whatsapp}
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setShowSharePopup(false)}
              >
                LinkedIn
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setShowSharePopup(false)}
              >
                {labels.facebook}
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className={[
                  'rounded-md px-3 py-2.5 text-start text-sm transition-colors hover:bg-white/5',
                  copied ? 'text-primary' : 'text-white/80 hover:text-white',
                  isRtl ? 'text-end' : '',
                ].join(' ')}
              >
                {copied ? labels.copied : labels.copyLink}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
