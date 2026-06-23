import Image from 'next/image';
import { getImageUrl } from '@/lib/api/client';

/* ─── Single photo tile ──────────────────────────────────── */

interface PhotoTileProps {
  src: string;
  label: string;
  className?: string;
}

function PhotoTile({ src, label, className = '' }: PhotoTileProps) {
  return (
    <div className={`group relative overflow-hidden bg-[#0d0d0d] ${className}`}>
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
    </div>
  );
}

/*
  Mosaic grid pattern (lg+, 6 images):
    col widths:  [38%] [31%] [31%]
    row heights: [220px] [200px] [200px]

    [0 row-span-2] [1]              [2]
    [0 cont      ] [3 col-span-2       ]
    [4           ] [5 col-span-2       ]

  For fewer than 6 images the mosaic overrides are skipped.
*/

function getMosaicClass(index: number, total: number): string {
  if (total !== 6) return '';
  const MOSAIC: Record<number, string> = {
    0: 'lg:row-span-2',
    3: 'lg:col-span-2',
    5: 'lg:col-span-2',
  };
  return MOSAIC[index] ?? '';
}

/* ─── Section ────────────────────────────────────────────── */

interface EventDetailsGalleryProps {
  locale?: string;
  gallery: string[];
}

export function EventDetailsGallery({ locale, gallery }: EventDetailsGalleryProps) {
  if (!gallery.length) return null;

  const isRtl = locale === 'ar';
  const items = gallery.map((id, i) => ({
    src: getImageUrl(id),
    label: `${isRtl ? 'صورة' : 'Photo'} ${i + 1}`,
  }));

  return (
    <section
      className="w-full bg-[var(--page-bg)] px-[clamp(1.5rem,4vw,3rem)] py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <h2 className="text-center font-sans text-[40px] font-bold uppercase tracking-[-0.48px] text-[#e2e2e2] sm:text-[48px]">
            {isRtl
              ? <><span className="text-primary">لحظات</span> من فعاليتنا</>
              : <>Moments from our <span className="text-primary">event</span></>
            }
          </h2>
          <div className="h-1 w-24 bg-primary" aria-hidden />
        </div>

        {/*
          Unified responsive grid:
            default  → 1 col,  auto rows = 60vw
            sm 640px → 2 cols, auto rows = 38vw
            md 768px → 3 cols, auto rows = 26vw
            lg 1024px→ mosaic (only when exactly 6 images)
        */}
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
