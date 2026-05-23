'use client';

import { useState } from 'react';

export interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
  /** Set to true to prevent deselecting by clicking the active star */
  allowClear?: boolean;
}

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  disabled,
  className,
  allowClear = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  // While hovering show hover preview; otherwise show the confirmed value
  const displayRating = hovered > 0 ? hovered : value;

  const handleClick = (star: number) => {
    if (disabled) return;
    // If clicking the current value and allowClear is on, clear the rating
    if (allowClear && star === value) {
      onChange?.(0);
    } else {
      onChange?.(star);
    }
  };

  return (
    <div
      className={`flex items-center ${className ?? ''}`}
      role="group"
      aria-label={`Star rating, ${value} of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          aria-pressed={value === star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className={`w-7 h-7 flex items-center justify-center transition-transform ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path
              d={STAR_PATH}
              fill={star <= displayRating ? '#eb0028' : 'none'}
              stroke="#eb0028"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
