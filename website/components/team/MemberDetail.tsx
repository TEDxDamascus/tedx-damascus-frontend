'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { teamApi, getImageUrl, type TeamMemberApiData } from '@/lib/api/client';
import { pickLocaleText } from '@/lib/utils';

interface MemberDetailProps {
  locale: string;
  /** 1-based member index — position in the live /team list, matching the grid's static routing slots. */
  index: number;
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

function extractLinkedin(links: string[] = []): string | undefined {
  return links.find((l) => l.toLowerCase().includes('linkedin.com'));
}

export function MemberDetail({ locale, index }: MemberDetailProps) {
  const tMember = useTranslations('TeamMember');
  const isRtl = locale === 'ar';

  const [live, setLive] = useState<TeamMemberApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    teamApi
      .getAll()
      .then((res: unknown) => {
        const raw: TeamMemberApiData[] = Array.isArray(res)
          ? res
          : ((res as { data?: TeamMemberApiData[] })?.data ?? []);
        setLive(raw[index - 1] ?? null);
      })
      .catch(() => setLive(null))
      .finally(() => setLoading(false));
  }, [index]);

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

  if (loading) {
    return (
      <div className="relative bg-page-bg" dir={isRtl ? 'rtl' : 'ltr'}>
        <Navbar locale={locale} />
        <div className="flex justify-center py-32">
          <span className="animate-pulse font-helvetica text-white/40">Loading...</span>
        </div>
      </div>
    );
  }

  if (!live) {
    return (
      <div className="relative bg-page-bg" dir={isRtl ? 'rtl' : 'ltr'}>
        <Navbar locale={locale} />
        <div className="flex justify-center py-32">
          <p className={['font-helvetica text-[#a8a8a8]', isRtl ? 'font-arabic' : ''].join(' ')}>
            {tMember('noData')}
          </p>
        </div>
      </div>
    );
  }

  const photo = getImageUrl(live.image);
  const name = pickLocaleText(live.name, locale);
  const category = `TEDx Damascus ${live.year ?? ''}`.trim();
  const bio = pickLocaleText(live.bio, locale);
  const linkedinUrl = extractLinkedin(live.social_link);
  const normalizedLinkedin = linkedinUrl ? normalizeExternalUrl(linkedinUrl) : undefined;

  const shareMessage = isRtl
    ? `تعرّف على ${name} في TEDx Damascus`
    : `Check out ${name} at TEDx Damascus`;

  const labels = {
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    copyLink: isRtl ? 'نسخ الرابط' : 'Copy Link',
    copied: isRtl ? 'تم النسخ!' : 'Copied!',
    shareVia: isRtl ? 'مشاركة عبر' : 'Share via',
  };

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

  const actionClass = [
    'flex items-center gap-2.5 font-sans text-[13px] font-bold uppercase tracking-[1px]',
    'text-[#A8A8A8] transition-colors hover:text-white',
    isRtl ? 'font-arabic normal-case tracking-normal' : '',
  ].join(' ');

  return (
    <div className="relative bg-page-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero: navbar + profile photo with corner brackets + identity ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-60" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/pattern.svg"
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
            loading="lazy"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-2/3 bg-[linear-gradient(to_bottom,#101010_0%,rgba(16,16,16,0.6)_55%,transparent_100%)]"
          aria-hidden
        />

        <div className="relative z-10">
          <Navbar locale={locale} />

          <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-32 lg:pt-40">
            <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-16">
              {/* Photo with L-bracket corner accents */}
              <div className="relative mx-auto w-full max-w-[380px] shrink-0 lg:mx-0 lg:w-[420px] lg:max-w-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/border-top-right.png"
                  alt=""
                  className="pointer-events-none absolute -right-3 -top-3 z-10 h-10 w-10 select-none lg:h-12 lg:w-12"
                  aria-hidden
                  draggable={false}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/border-bottom-left.png"
                  alt=""
                  className="pointer-events-none absolute -bottom-3 -left-3 z-10 h-10 w-10 select-none lg:h-12 lg:w-12"
                  aria-hidden
                  draggable={false}
                />
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={name} className="h-full w-full object-cover" draggable={false} />
                </div>
              </div>

              {/* Identity */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className={['font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-white/60', isRtl ? 'font-arabic' : ''].join(' ')}>
                    {category}
                  </span>
                </div>

                <h1
                  className={[
                    'font-helvetica text-[40px] font-normal uppercase leading-[1.1] text-white lg:text-[57px]',
                    isRtl ? 'font-arabic' : '',
                  ].join(' ')}
                >
                  {name}
                </h1>

                <div className="relative mt-4 flex flex-wrap items-center gap-10 sm:gap-12">
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
                      <span>{tMember('linkedIn')}</span>
                    </Link>
                  )}

                  <button type="button" onClick={handleShare} className={actionClass}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/speakers/share-button.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="shrink-0"
                      draggable={false}
                    />
                    <span>{tMember('pressKit')}</span>
                  </button>

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
        </div>
      </section>

      {/* ── Content: journey ── */}
      {bio && (
        <section className="relative z-10 px-6 pb-24">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
            <div className="relative overflow-hidden bg-card-bg p-8 lg:p-10">
              <span
                className="pointer-events-none absolute -top-4 select-none font-helvetica text-[140px] font-black leading-none text-white/5 lg:text-[160px]"
                style={isRtl ? { left: 24 } : { right: 24 }}
                aria-hidden
              >
                &rdquo;
              </span>
              <h2 className="font-sans text-[12px] font-bold uppercase tracking-[1.5px] text-primary">{tMember('journeyLabel')}</h2>
              <div className="relative mt-6 flex flex-col gap-4">
                <p className={['max-w-3xl font-helvetica text-[16px] leading-[1.6] text-[#d7d7d7]', isRtl ? 'font-arabic' : ''].join(' ')}>
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
