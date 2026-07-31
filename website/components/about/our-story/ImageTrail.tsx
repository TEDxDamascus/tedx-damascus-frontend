'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0;
  let clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  el: HTMLDivElement;
  rect: DOMRect | null = null;

  constructor(el: HTMLDivElement) {
    this.el = el;
    this.getRect();
    window.addEventListener('resize', () => this.getRect());
  }

  private getRect() {
    this.rect = this.el.getBoundingClientRect();
  }
}

/**
 * Cursor-following image trail, adapted from reactbits.dev's ImageTrail (variant 1)
 * onto this project's existing gsap dependency. Each thumbnail keeps the same
 * black gradient vignette framing used by the Events cards (see EventCardHome).
 */
class Trail {
  private container: HTMLDivElement;
  private images: ImageItem[];
  private imgPosition = 0;
  private zIndexVal = 1;
  private activeImagesCount = 0;
  private isIdle = true;
  private threshold = 80;
  private mousePos = { x: 0, y: 0 };
  private lastMousePos = { x: 0, y: 0 };
  private cacheMousePos = { x: 0, y: 0 };
  private rafId: number | null = null;
  private cleanupFns: Array<() => void> = [];

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.images = [...container.querySelectorAll<HTMLDivElement>('.content__img')].map(
      (el) => new ImageItem(el)
    );

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);
    this.cleanupFns.push(() => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
    });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender);
    this.cleanupFns.push(() => {
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    });
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    if (this.images.length === 0) return;
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.images.length - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    const width = img.rect?.width ?? 0;
    const height = img.rect?.height ?? 0;

    gsap.killTweensOf(img.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - width / 2,
          y: this.cacheMousePos.y - height / 2,
        },
        {
          duration: 0.4,
          ease: 'power1',
          x: this.mousePos.x - width / 2,
          y: this.mousePos.y - height / 2,
        },
        0
      )
      .to(
        img.el,
        {
          duration: 0.4,
          ease: 'power3',
          opacity: 0,
          scale: 0.2,
        },
        0.4
      );
  }

  private onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  private onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }

  destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.cleanupFns.forEach((fn) => fn());
    this.images.forEach((img) => gsap.killTweensOf(img.el));
  }
}

interface ImageTrailProps {
  items: string[];
  className?: string;
}

export function ImageTrail({ items, className = '' }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const trail = new Trail(containerRef.current);
    return () => trail.destroy();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-[60] overflow-visible ${className}`}
      aria-hidden
    >
      {items.map((url, i) => (
        <div
          key={url + i}
          className="content__img absolute left-0 top-0 aspect-[4/5] w-[170px] overflow-hidden rounded-2xl opacity-0 [will-change:transform,opacity]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
          {/* Same edge-vignette treatment as the Events cards (EventCardHome) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[25%] bg-gradient-to-r from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[25%] bg-gradient-to-l from-black/50 to-transparent" />
        </div>
      ))}
    </div>
  );
}
