'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, type AnimationPlaybackControls } from 'framer-motion';

type OnHoverBehavior = 'speedUp' | 'slowDown' | 'pause' | 'goBonkers' | null;

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: OnHoverBehavior;
  className?: string;
}

export function CircularText({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
}: CircularTextProps) {
  const letters = Array.from(text);
  const rotation = useMotionValue(0);
  const ctrlRef = useRef<AnimationPlaybackControls | null>(null);

  const startSpin = (dur: number) => {
    ctrlRef.current?.stop();
    const from = rotation.get();
    // Animate 200 full rotations — cosmetically infinite without ever resetting to 0
    ctrlRef.current = animate(rotation, from + 360 * 200, {
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
      {letters.map((letter, i) => {
        const deg = (360 / letters.length) * i;
        return (
          <span
            key={i}
            className="absolute inset-0 flex items-start justify-center pt-[11px] text-[12px] font-bold select-none text-secondary opacity-[0.8]"
            style={{ transform: `rotateZ(${deg}deg)`, WebkitTransform: `rotateZ(${deg}deg)` }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}
