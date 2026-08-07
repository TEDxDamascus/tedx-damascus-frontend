'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SPEAKER_PLACEHOLDER = '/images/speakers/Background.png';
const PATTERN_SRC = '/images/about/pattern.svg';

export interface SpeakerDetailHeaderProps {
  name: string;
  bio: string;
  description: string;
  imageUrl?: string;
  linkedinUrl?: string;
  isRtl: boolean;
}

function normalizeExternalUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

function buildShareLinks(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}

export function SpeakerDetailHeader({
  name,
  bio,
  description,
  imageUrl,
  linkedinUrl,
  isRtl,
}: SpeakerDetailHeaderProps) {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const shareMessage = isRtl
    ? `تعرّف على ${name} في TEDx Damascus`
    : `Check out ${name} at TEDx Damascus`;

  const labels = {
    linkedin: isRtl ? 'لينكد إن' : 'LINKEDIN',
    share: isRtl ? 'مشاركة' : 'PRESS KIT',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    copyLink: isRtl ? 'نسخ الرابط' : 'Copy Link',
    copied: isRtl ? 'تم النسخ!' : 'Copied!',
    shareVia: isRtl ? 'مشاركة عبر' : 'Share via',
  };

  useEffect(() => {
    if (!showSharePopup) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowSharePopup(false);
    }

    function onPointerDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowSharePopup(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [showSharePopup]);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title || name;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: shareMessage, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }

    setShowSharePopup(true);
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

  const normalizedLinkedin = linkedinUrl ? normalizeExternalUrl(linkedinUrl) : undefined;

  const actionClass = [
    'flex items-center gap-2.5 font-sans text-[13px] font-bold uppercase tracking-[1px]',
    'text-[#A8A8A8] transition-colors hover:text-white',
    isRtl ? 'font-arabic normal-case tracking-normal' : '',
  ].join(' ');

  return (
    <section
      className="relative overflow-hidden bg-black"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Background pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PATTERN_SRC}
          alt=""
          className={[
            'absolute inset-0 h-full w-full select-none object-cover object-top opacity-60',
            isRtl ? 'scale-x-[-1]' : '',
          ].join(' ')}
          draggable={false}
        />
        <div
          className={[
            'absolute inset-y-0 w-[65%] to-transparent',
            isRtl
              ? 'right-0 bg-gradient-to-l from-black via-black/95'
              : 'left-0 bg-gradient-to-r from-black via-black/95',
          ].join(' ')}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-[1180px] px-[clamp(1rem,5vw,4rem)] pb-8 pt-32 sm:pb-10 sm:pt-36 lg:pt-40">
        <div
          className={[
            'flex flex-col items-center gap-10',
            'sm:flex-row sm:items-center sm:gap-12 lg:gap-16',
          ].join(' ')}
        >
          {/* ── Photo ── */}
          <div className="relative shrink-0 w-[240px] sm:w-[280px] lg:w-[340px]">
            <div
              aria-hidden
              className={[
                'pointer-events-none absolute z-0 w-[100px] h-[104px]',
                isRtl
                  ? '-left-[45px] -top-[50px]'
                  : '-right-[45px] -top-[50px]',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/add-your-line/triangle.svg" alt="" className="w-full h-full" draggable={false} />
            </div>

            <div
              aria-hidden
              className={[
                'pointer-events-none absolute z-0 w-[160px] h-[155px]',
                isRtl
                  ? '-right-[60px] -bottom-[55px]'
                  : '-left-[60px] -bottom-[55px]',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/add-your-line/rectangle.svg" alt="" className="w-full h-full" draggable={false} />
            </div>

            <div className="relative z-[1] aspect-[3/4] w-full overflow-hidden">
              <Image
                src={imageUrl || SPEAKER_PLACEHOLDER}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 340px"
                priority
              />
            </div>
          </div>

          {/* ── Text content ── */}
          <div
            className={[
              'flex flex-col flex-1',
              isRtl ? 'items-end text-end gap-4' : 'items-start text-start gap-4',
            ].join(' ')}
          >
            <h1
              className={[
                'text-primary font-bold leading-tight',
                'text-4xl sm:text-5xl lg:text-[54px]',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              {name}
            </h1>

            {bio && (
              <p
                className={[
                  'text-white font-bold text-base sm:text-lg leading-relaxed',
                  isRtl ? 'font-arabic' : 'font-helvetica',
                ].join(' ')}
              >
                {bio}
              </p>
            )}

            {description && (
              <p
                className={[
                  'text-white/70 font-normal text-sm sm:text-base leading-relaxed max-w-[500px]',
                  isRtl ? 'font-arabic' : 'font-sans',
                ].join(' ')}
              >
                <span className="text-primary font-bold">&quot;</span>
                {description.replace(/^[""]|[""]$/g, '')}
                <span className="text-primary font-bold">&quot;</span>
              </p>
            )}

            {/* LinkedIn + Share */}
            <div
              className={[
                'relative mt-10 sm:mt-12 flex flex-wrap items-center gap-10 sm:gap-12',
                isRtl ? 'justify-end' : 'justify-start',
              ].join(' ')}
            >
              {normalizedLinkedin && (
                <Link
                  href={normalizedLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/speakers/linked-in.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                    draggable={false}
                  />
                  <span>{labels.linkedin}</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleShare}
                className={actionClass}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/speakers/share-button.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                  draggable={false}
                />
                <span>{labels.share}</span>
              </button>

              {/* Fallback share popup */}
              {showSharePopup && (
                <div
                  ref={popupRef}
                  role="dialog"
                  aria-label={labels.shareVia}
                  className={[
                    'absolute z-20 top-full mt-3 min-w-[220px] rounded-lg border border-white/10 bg-[#1a1a1a] p-3 shadow-xl',
                    isRtl ? 'end-0' : 'start-0',
                  ].join(' ')}
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
                      href={buildShareLinks(window.location.href, shareMessage).whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setShowSharePopup(false)}
                    >
                      {labels.whatsapp}
                    </a>
                    <a
                      href={buildShareLinks(window.location.href, shareMessage).linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setShowSharePopup(false)}
                    >
                      LinkedIn
                    </a>
                    <a
                      href={buildShareLinks(window.location.href, shareMessage).facebook}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
