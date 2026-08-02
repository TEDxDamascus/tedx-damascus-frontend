'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Linkedin, X, Share2, Copy, Check } from 'lucide-react';

interface ShareCommunityBarProps {
  locale: string;
  url: string;
}

function buildShareLinks(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    instagram: 'https://www.instagram.com/TEDxDamascus',
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
  };
}

export function ShareCommunityBar({ locale, url }: ShareCommunityBarProps) {
  const t = useTranslations('OurStory');
  const isRtl = locale === 'ar';
  const [copied, setCopied] = useState(false);

  const shareText = `${t('titlePrefix')} ${t('titleHighlight')}`.trim();
  const shareLinks = buildShareLinks(url, shareText);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }
    handleCopy();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — no-op
    }
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[14px] bg-primary p-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-[0.12] mix-blend-multiply" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about/pattern.svg" alt="" className="h-full w-full object-cover object-center" draggable={false} />
      </div>

      <div className="relative z-10 flex h-[82px] items-center gap-[10px]">
        <div className="flex h-full shrink-0 items-center justify-center rounded-[10px] bg-white p-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/our-story/share-qr.png"
            alt=""
            className="h-full w-auto rounded-[4px]"
            draggable={false}
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-2 min-w-0">
          <p
            className={[
              'w-full font-helvetica text-[16px] font-bold leading-6 tracking-[0.15px] text-[#101010]',
              isRtl ? 'font-arabic' : '',
            ].join(' ')}
          >
            {t('shareTitle')}
          </p>
          <div className="flex items-center gap-[10px]">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#101010] hover:opacity-70 transition-opacity">
              <Facebook className="size-6 fill-current stroke-none" />
            </a>
            <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#101010] hover:opacity-70 transition-opacity">
              <Instagram className="size-6" />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#101010] hover:opacity-70 transition-opacity">
              <Linkedin className="size-6 fill-current stroke-none" />
            </a>
            <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="text-[#101010] hover:opacity-70 transition-opacity">
              <X className="size-6" />
            </a>
            <button type="button" onClick={handleShare} aria-label="Share" className="text-[#101010] hover:opacity-70 transition-opacity">
              <Share2 className="size-6" />
            </button>
            <button type="button" onClick={handleCopy} aria-label="Copy link" className="text-[#101010] hover:opacity-70 transition-opacity">
              {copied ? <Check className="size-6" /> : <Copy className="size-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
