'use client';

import { useEffect, useRef, useId } from 'react';
import { motion, useMotionValue, animate, type AnimationPlaybackControls } from 'framer-motion';

type OnHoverBehavior = 'speedUp' | 'slowDown' | 'pause' | 'goBonkers' | null;

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: OnHoverBehavior;
  className?: string;
}

// Circle geometry — badge is 174×174, text sits at radius 74 from center (87,87)
const R = 74;
const CX = 87;
const CY = 87;
const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 465 px

// Clockwise circle path starting from the leftmost point
const CIRCLE_D = `M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`;

// Arabic unicode range check
function containsArabic(str: string): boolean {
  return /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(str);
}

export function CircularText({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
}: CircularTextProps) {
  const rawId = useId();
  const pathId = `ct${rawId.replace(/:/g, '')}`;

  const rotation = useMotionValue(0);
  const ctrlRef = useRef<AnimationPlaybackControls | null>(null);

  const isArabic = containsArabic(text);

  const startSpin = (dur: number) => {
    ctrlRef.current?.stop();
    const from = rotation.get();
    ctrlRef.current = animate(rotation, from - 360 * 200, {
      duration: dur * 200,
      ease: 'linear',
    });
  };

  useEffect(() => {
    startSpin(spinDuration);
    return () => ctrlRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, text]);

  const handleHoverStart = () => {
    if (!onHover) return;
    if (onHover === 'pause') { ctrlRef.current?.stop(); return; }
    const durMap: Record<string, number> = {
      slowDown:  spinDuration * 2,
      speedUp:   spinDuration / 4,
      goBonkers: spinDuration / 20,
    };
    startSpin(durMap[onHover] ?? spinDuration);
  };

  const handleHoverEnd = () => startSpin(spinDuration);

  return (
    <motion.div
      className={`relative rounded-full ${className}`}
      style={{ rotate: rotation }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* SVG textPath renders the full text string in one pass so the font shaper
          can apply proper contextual forms — including Arabic letter joining.
          For Arabic: skip textLength/lengthAdjust which adds artificial glyph spacing
          and breaks connected-letter shaping. The text is pre-repeated in the caller
          to fill the circumference without forced stretching. */}
      <svg viewBox="0 0 174 174" className="w-full h-full" aria-hidden>
        <defs>
          <path id={pathId} d={CIRCLE_D} />
        </defs>
        {/* direction="ltr" forces clockwise flow so Arabic glyphs appear on the
            outside of the circle. Without it, RTL text flows counterclockwise
            (into the interior) and becomes invisible. */}
        <text
          direction="ltr"
          fontSize="11.5"
          fontWeight="bold"
          fontFamily={isArabic ? 'Cairo, sans-serif' : 'Helvetica Neue, Helvetica, Arial, sans-serif'}
          fill="white"
          fillOpacity="0.8"
        >
          <textPath
            href={`#${pathId}`}
            {...(!isArabic && {
              textLength: Math.round(CIRCUMFERENCE),
              lengthAdjust: 'spacing',
            })}
          >
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}
