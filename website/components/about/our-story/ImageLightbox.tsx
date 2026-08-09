'use client';

import { useCallback, useEffect } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: initialIndex });

  // Jump to the clicked image whenever the lightbox opens (or the clicked image changes).
  useEffect(() => {
    if (open && emblaApi) emblaApi.scrollTo(initialIndex, true);
  }, [open, initialIndex, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose, scrollNext, scrollPrev]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 px-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="w-full max-w-5xl overflow-hidden"
            ref={emblaRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex">
              {images.map((src, i) => (
                <div key={i} className="relative min-w-0 flex-[0_0_100%] flex items-center justify-center px-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="max-h-[80vh] w-auto max-w-full select-none rounded-lg object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); scrollNext(); }}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
