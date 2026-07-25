'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

async function fetchYouTubeTitle(url: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data.title ?? '';
  } catch {
    return '';
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&\s]+)/
  );
  return match ? match[1] : null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

interface VideoCardProps {
  url: string;
  index: number;
  isRtl: boolean;
  title?: string;
}

function VideoCard({ url, index, isRtl, title }: VideoCardProps) {
  const videoId = getYouTubeId(url);
  const thumbnail = videoId ? getYouTubeThumbnail(videoId) : null;
  const label = title || (isRtl ? `فيديو ${index + 1}` : `Video ${index + 1}`);

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'group flex gap-3 rounded-md bg-[#1a1a1a] p-2.5 hover:bg-[#222] transition-colors',
        isRtl ? 'flex-row-reverse' : 'flex-row',
      ].join(' ')}
    >
      {/* Thumbnail — small, fixed size */}
      <div className="relative shrink-0 w-[110px] h-[72px] overflow-hidden rounded-sm bg-black">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={label}
            fill
            className="object-cover"
            sizes="110px"
          />
        ) : (
          <div className="absolute inset-0 bg-[#111]" />
        )}
        {/* Mini play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right: title + link icon */}
      <div
        className={[
          'flex flex-1 flex-col justify-between min-w-0',
          isRtl ? 'items-end text-end' : 'items-start text-start',
        ].join(' ')}
      >
        <p
          className={[
            'text-white text-xs sm:text-sm font-normal leading-snug line-clamp-3',
            isRtl ? 'font-arabic' : 'font-sans',
          ].join(' ')}
        >
          {label}
        </p>

        {/* External link icon */}
        <div className="mt-1 flex items-center gap-1 text-[#4ade80]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

interface SpeakerDetailVideosProps {
  videoLinks: string[];
  locale?: string;
}

export function SpeakerDetailVideos({ videoLinks, locale }: SpeakerDetailVideosProps) {
  const valid = videoLinks.filter((url) => url.trim());
  const isRtl = locale === 'ar';

  const [titles, setTitles] = useState<string[]>([]);
  const validKey = valid.join(',');

  useEffect(() => {
    if (valid.length === 0) return;
    Promise.all(valid.map((url) => fetchYouTubeTitle(url))).then(setTitles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validKey]);

  if (valid.length === 0) return null;

  return (
    <section
      className="w-full bg-black px-[clamp(1rem,5vw,4rem)] pt-8 pb-14 sm:pt-10 sm:pb-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1180px] flex flex-col gap-6">

        {/* Title */}
        <h2
          className={[
            'text-primary font-bold text-xl sm:text-2xl leading-snug',
            isRtl ? 'font-arabic' : 'font-helvetica',
          ].join(' ')}
        >
          {isRtl ? 'شاهد المحاضرة' : 'Watch the Talk'}
        </h2>

        {/* Video cards grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {valid.map((url, i) => (
            <VideoCard
              key={i}
              url={url}
              index={i}
              isRtl={isRtl}
              title={titles[i]}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
