'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api/client';
import { ImageLightbox } from '@/components/shared/ImageLightbox';

interface PhotoTileProps {
  src: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

function PhotoTile({ src, label, className = '', onClick }: PhotoTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-full w-full cursor-pointer overflow-hidden border-0 bg-[#0d0d0d] p-0 ${className}`}
    >
      <Image
        src={src}
        alt={label}
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
      />
      <div className="absolute inset-0 flex items-end bg-black/40 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-white">
          {label}
        </span>
      </div>
    </button>
  );
}

function getMosaicClass(index: number, total: number): string {
  if (total !== 6) return '';
  const MOSAIC: Record<number, string> = {
    0: 'lg:row-span-2',
    3: 'lg:col-span-2',
    5: 'lg:col-span-2',
  };
  return MOSAIC[index] ?? '';
}

interface SpeakerDetailGalleryProps {
  gallery: string[];
  locale?: string;
}

export function SpeakerDetailGallery({ gallery, locale }: SpeakerDetailGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const isRtl = locale === 'ar';

  const items = gallery.map((url, i) => ({
    src: getImageUrl(url),
    label: `${isRtl ? 'صورة' : 'Photo'} ${i + 1}`,
  }));

  return (
    <section
      className="w-full bg-black px-[clamp(1rem,5vw,4rem)] pt-8 pb-8 sm:pt-10 sm:pb-10"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1180px]">

        {/* Heading */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <h2 className="text-center font-helvetica text-[36px] sm:text-[44px] font-bold text-white">
            {isRtl
              ? <><span className="text-primary">لقطات</span> من المتحدث</>
              : <>Speaker <span className="text-primary">Spotlight</span></>
            }
          </h2>
        </div>

        {/* Mosaic grid — same logic as EventDetailsGallery */}
        <div
          className={[
            'grid gap-2',
            'grid-cols-1 auto-rows-[60vw]',
            'sm:grid-cols-2 sm:auto-rows-[38vw]',
            'md:grid-cols-3 md:auto-rows-[26vw]',
            items.length === 6
              ? 'lg:grid-cols-[38%_31%_31%] lg:grid-rows-[220px_200px_200px] lg:auto-rows-[200px]'
              : 'lg:auto-rows-[280px]',
          ].join(' ')}
        >
          {items.map((g, i) => (
            <PhotoTile
              key={i}
              src={g.src}
              label={g.label}
              className={getMosaicClass(i, items.length)}
              onClick={() => setOpenIndex(i)}
            />
          ))}
        </div>

      </div>

      <ImageLightbox
        images={items.map((g) => g.src)}
        initialIndex={openIndex ?? 0}
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
