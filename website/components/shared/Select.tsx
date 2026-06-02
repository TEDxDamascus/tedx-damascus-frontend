'use client';

import { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled,
  className,
  dir = 'ltr',
}: SelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const hasValue = Boolean(selectedOption);
  const isError = Boolean(error);
  const isActive = focused || open;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const underlineBg = disabled
    ? 'bg-[#363636]'
    : isError
    ? 'bg-[#eb0028]'
    : isActive
    ? 'bg-[#eb0028]'
    : 'bg-[#525252]';

  const underlineStyle = isActive && !isError ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' } : undefined;

  const handleSelect = (optValue: string) => {
    onChange?.(optValue);
    setOpen(false);
    setFocused(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-0 w-full ${className ?? ''}`}
      dir={dir}
    >
      {/* Trigger with floating label */}
      <div className="relative">
        {label && (
          <span
            className={[
              'absolute left-[10px] pointer-events-none select-none font-helvetica transition-all duration-150 z-10',
              hasValue || isActive
                ? 'top-[3px] text-[10px] leading-none ' + (disabled ? 'text-[#666]' : 'text-[#aaa]')
                : 'top-[18px] text-base text-[#888]',
            ].join(' ')}
          >
            {label}
          </span>
        )}
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            if (!disabled) {
              setOpen((o) => !o);
              setFocused(true);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => !open && setFocused(false)}
          className={`flex items-center justify-between px-[10px] w-full bg-transparent text-left ${
            label ? 'pt-[18px] pb-[6px]' : 'py-[8px]'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <span
            className={`font-helvetica text-base leading-normal ${
              hasValue ? 'text-white' : 'text-transparent'
            }`}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={open ? '#eb0028' : '#bebebe'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className={`h-px w-full transition-colors ${underlineBg}`} style={underlineStyle} />
      </div>

      {/* Error message */}
      {isError && (
        <div role="alert" className="flex items-center gap-2 mt-[2px]">
          <svg className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#eb0028"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#eb0028" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="#eb0028" stroke="#eb0028" strokeWidth="1" />
          </svg>
          <span className="font-helvetica text-xs text-[#680010]">{error}</span>
        </div>
      )}

      {/* Dropdown list */}
      {open && (
        <ul
          role="listbox"
          aria-label={label ?? placeholder}
          className="absolute top-full left-0 right-0 z-50 bg-[#101010] shadow-[2px_4px_3px_rgba(0,0,0,0.3),-2px_4px_2px_rgba(0,0,0,0.25)] mt-0"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={`h-[50px] flex items-center px-6 border-b border-[rgba(82,82,82,0.5)] cursor-pointer select-none font-helvetica text-base text-white transition-colors ${
                opt.value === value ? 'bg-[#1b0f11]' : 'hover:bg-[#1b0f11]'
              } ${dir === 'rtl' ? 'justify-end' : ''}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
