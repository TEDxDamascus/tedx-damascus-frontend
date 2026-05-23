'use client';

import { useState, useRef, useEffect, useId } from 'react';

export interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatDate(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function buildCalendarGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; type: 'prev' | 'current' | 'next' }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - firstDayOfWeek + 1, type: 'next' });
  }

  return cells;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e6e6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e6e6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function DatePicker({
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder = 'DD/MM/YYYY',
  className,
}: DatePickerProps) {
  const id = useId();
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [calMonth, setCalMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [calYear, setCalYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [pendingDate, setPendingDate] = useState<Date | null>(value ?? null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasValue = Boolean(value);
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

  useEffect(() => {
    if (value) {
      setCalMonth(value.getMonth());
      setCalYear(value.getFullYear());
      setPendingDate(value);
    }
  }, [value]);

  const underlineBg = disabled
    ? 'bg-[#363636]'
    : isError
    ? 'bg-[#eb0028]'
    : isActive
    ? 'bg-[#eb0028]'
    : 'bg-[#525252]';

  const underlineStyle = isActive && !isError ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' } : undefined;

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const handleOk = () => {
    onChange?.(pendingDate);
    setOpen(false);
    setFocused(false);
  };

  const handleCancel = () => {
    setPendingDate(value ?? null);
    setOpen(false);
    setFocused(false);
  };

  const isSelectedDay = (day: number) =>
    pendingDate !== null &&
    pendingDate.getDate() === day &&
    pendingDate.getMonth() === calMonth &&
    pendingDate.getFullYear() === calYear;

  const cells = buildCalendarGrid(calYear, calMonth);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 w-full ${className ?? ''}`}>
      {/* Floating label */}
      {label && (hasValue || isActive || isError) && (
        <label
          htmlFor={id}
          className={`font-helvetica text-base leading-normal ${disabled ? 'text-[#777]' : 'text-[#e0e0e0]'}`}
        >
          {label}
        </label>
      )}

      {/* Trigger row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 px-[10px]">
          <button
            id={id}
            type="button"
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => !open && setFocused(false)}
            onClick={() => !disabled && setOpen((o) => !o)}
            className="flex-1 min-w-0 text-left bg-transparent border-none outline-none disabled:cursor-not-allowed"
          >
            <span
              className={`font-['Inter',sans-serif] text-base leading-normal ${
                hasValue ? 'text-[#bebebe]' : 'text-[rgba(255,255,255,0.4)]'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              {hasValue && value ? formatDate(value) : placeholder}
            </span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}
            aria-label="Toggle calendar"
            tabIndex={-1}
            className="shrink-0 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={open ? '#eb0028' : disabled ? '#525252' : '#bebebe'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
        </div>
        <div className={`h-px w-full transition-colors ${underlineBg}`} style={underlineStyle} />
      </div>

      {/* Error message */}
      {isError && (
        <div role="alert" className="flex items-center gap-2">
          <svg className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#eb0028" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#eb0028" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="#eb0028" stroke="#eb0028" strokeWidth="1" />
          </svg>
          <span className="font-helvetica text-xs text-[#680010]">{error}</span>
        </div>
      )}

      {/* Calendar panel */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1a1a1a] border border-[rgba(181,181,181,0.1)] rounded-sm"
          dir="ltr"
        >
          {/* Month + Year navigation */}
          <div className="flex items-center justify-between h-16 px-2">
            <div className="flex items-center">
              <button
                type="button"
                onClick={prevMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
              >
                <ChevronLeft />
              </button>
              <span className="text-white font-helvetica text-sm min-w-[44px] text-center">
                {MONTH_NAMES[calMonth]}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setCalYear((y) => y - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
              >
                <ChevronLeft />
              </button>
              <span className="text-white font-helvetica text-sm min-w-[44px] text-center">{calYear}</span>
              <button
                type="button"
                onClick={() => setCalYear((y) => y + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="h-12 flex items-center justify-center text-[#e6e6e6] text-base">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 px-3 pb-1">
            {cells.map((cell, i) => {
              const selected = cell.type === 'current' && isSelectedDay(cell.day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={cell.type !== 'current'}
                  onClick={() => cell.type === 'current' && setPendingDate(new Date(calYear, calMonth, cell.day))}
                  className={[
                    'h-12 w-full flex items-center justify-center rounded-full text-base transition-colors',
                    selected
                      ? 'bg-[#eb0028] text-[#e6e6e6]'
                      : cell.type !== 'current'
                      ? 'text-[#e6e6e6] opacity-[0.38] cursor-default'
                      : 'text-[#e6e6e6] hover:bg-[rgba(235,0,40,0.1)] cursor-pointer',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Cancel / OK */}
          <div className="flex justify-end gap-1 px-3 py-1">
            <button
              type="button"
              onClick={handleCancel}
              className="h-12 px-4 text-[#eb0028] font-helvetica text-sm rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOk}
              className="h-12 px-4 text-[#eb0028] font-helvetica text-sm rounded-full hover:bg-[rgba(235,0,40,0.1)] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
