'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, open, onClose }: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && images.length > 0 && (
        <LightboxBody
          key={`${images.join('|')}-${initialIndex}`}
          images={images}
          initialIndex={initialIndex}
          onClose={onClose}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function LightboxBody({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const startIndex = Math.min(Math.max(initialIndex, 0), images.length - 1);
  const canNav = images.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canNav,
    startIndex,
    duration: 22,
  });
  const [selected, setSelected] = useState(startIndex);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const thumb = thumbRefs.current[selected];
    const strip = stripRef.current;
    if (!thumb || !strip) return;
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [selected]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') scrollNext();
      if (e.key === 'ArrowLeft') scrollPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose, scrollNext, scrollPrev]);

  return (
    <motion.div
      key="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex flex-col bg-black/95"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:top-6 sm:right-6"
      >
        <X size={22} />
      </button>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {canNav && (
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous image"
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="w-full max-w-5xl overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex min-w-0 flex-[0_0_100%] items-center justify-center px-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="max-h-[min(70vh,calc(100vh-11rem))] w-auto max-w-full select-none rounded-lg object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {canNav && (
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next image"
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div
        className="shrink-0 px-4 pb-5 pt-3 sm:pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={stripRef}
          className="mx-auto max-w-5xl overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-max gap-2 px-1">
            {images.map((src, i) => {
              const isActive = i === selected;
              return (
                <button
                  key={`thumb-${src}-${i}`}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Image ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'relative h-14 w-14 shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16',
                    'ring-2 transition-opacity',
                    isActive ? 'ring-primary opacity-100' : 'ring-transparent opacity-55 hover:opacity-90',
                  ].join(' ')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-center font-helvetica text-xs tracking-wide text-white/45">
          {selected + 1} / {images.length}
        </p>
      </div>
    </motion.div>
  );
}
