'use client';

import { useState } from 'react';
import { DatePicker, MultipleChoice, StarRating, TextInput } from '@/components/shared';
import type { ApiQuestion } from '@/types/form-schema';

// ─── Phone input with country code ────────────────────────────────────────────


function SyrianFlagIcon() {
  return (
    <div className="w-6 h-[17px] relative overflow-hidden shrink-0 rounded-[1px] select-none" aria-hidden>
      <div className="absolute inset-x-0 h-[5.67px] bg-[#007A3D]" style={{ top: 0 }} />
      <div className="absolute inset-x-0 h-[5.66px] bg-[#F1F1F1]" style={{ top: 5.67 }} />
      <div className="absolute inset-x-0 h-[5.67px] bg-[#101010]" style={{ top: 11.33 }} />
      <div className="absolute w-[2.5px] h-[2.5px] bg-[#EB0028]" style={{ left: '19%', top: '43%' }} />
      <div className="absolute w-[2.5px] h-[2.5px] bg-[#EB0028]" style={{ left: '45%', top: '43%' }} />
      <div className="absolute w-[2.5px] h-[2.5px] bg-[#EB0028]" style={{ left: '71%', top: '43%' }} />
    </div>
  );
}

function PhoneInput({ label, value, onChange, error }: {
  label: string; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  const parseNumber = (v: string) => {
    if (!v.trim()) return '';
    // strip +963 with or without trailing space
    return v.trim().replace(/^\+963\s*/, '');
  };
  const [number,    setNumber]    = useState(parseNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  // No space between country code and digits — backend expects +963XXXXXXXXX
  const update = (n: string) => onChange(n.trim() ? `+963${n}` : '');

  const isError = !!error;

  const underlineBg    = isError ? 'bg-[#eb0028]' : isFocused ? 'bg-[#eb0028]' : 'bg-[#525252]';
  const underlineStyle = isFocused && !isError
    ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' }
    : undefined;

  return (
    <div className="flex flex-col gap-[2px] items-start w-full">
      <div className="relative w-full">
        {/* Label always pinned at top — flag is always visible so no floating needed */}
        {label && (
          <label className="absolute start-[10px] top-[3px] text-[10px] leading-none text-[#E0E0E0] pointer-events-none select-none font-helvetica">
            {label}
          </label>
        )}
        <div className={`flex items-center gap-2 w-full ps-[10px] pe-[10px] overflow-hidden ${label ? 'pt-[18px] pb-[6px]' : 'py-[8px]'}`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <SyrianFlagIcon />
            <span className="text-[#bebebe] font-helvetica text-sm select-none">+963</span>
          </div>
          <span className="text-[#525252] select-none shrink-0">|</span>
          <input
            type="tel"
            value={number}
            maxLength={15}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '');
              setNumber(digitsOnly);
              update(digitsOnly);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="xxxxxxxxx"
            className="flex-1 min-w-0 bg-transparent border-none text-[#BEBEBE] font-helvetica text-base outline-none placeholder:text-transparent focus:placeholder:text-[rgba(255,255,255,0.3)] caret-[#eb0028]"
          />
        </div>
        <div className={`h-px w-full transition-colors duration-150 ${underlineBg}`} style={underlineStyle} />
      </div>
      {isError && (
        <div className="flex items-center gap-2 w-full mt-[2px]">
          <svg aria-hidden className="shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#eb0028" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#eb0028" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="#eb0028" stroke="#eb0028" strokeWidth="1" />
          </svg>
          <span className="font-helvetica text-xs text-[#eb0028]">{error}</span>
        </div>
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange, error, min, max }: {
  label: string; value: string;
  onChange: (v: number | '') => void; error?: string;
  min?: number; max?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue   = value !== '' && value != null;
  const isError    = !!error;
  const isFloating = Boolean(hasValue) || isFocused || isError;

  const underlineBg    = isError ? 'bg-[#eb0028]' : isFocused ? 'bg-[#eb0028]' : 'bg-[#525252]';
  const underlineStyle = isFocused && !isError
    ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' }
    : undefined;

  const increment = () => {
    const current = value !== '' ? Number(value) : 0;
    if (max === undefined || current < max) onChange(current + 1);
  };

  const decrement = () => {
    const current = value !== '' ? Number(value) : 0;
    const next = current - 1;
    if (min === undefined || next >= min) onChange(next);
  };

  return (
    <div className="flex flex-col gap-[2px] items-start w-full">
      <div className="relative w-full">
        {label && (
          <label className={[
            'absolute start-[10px] pointer-events-none select-none font-helvetica transition-all duration-150',
            isFloating
              ? 'top-[3px] text-[10px] leading-none text-[#E0E0E0] opacity-100'
              : 'top-[3px] text-[10px] leading-none text-[#E0E0E0] opacity-0',
          ].join(' ')}>
            {label}
          </label>
        )}
        <div className={`flex items-center gap-2 w-full ps-[10px] pe-[10px] ${label ? 'pt-[18px] pb-[6px]' : 'py-[8px]'}`}>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="flex-1 min-w-0 font-helvetica text-base bg-transparent border-none outline-none text-[#BEBEBE] caret-[#eb0028] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <div className="flex flex-col shrink-0 gap-[3px]">
            <button type="button" onClick={increment} className="flex items-center justify-center hover:opacity-70 transition-opacity">
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M1 6L6 1L11 6" stroke="#EB0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" onClick={decrement} className="flex items-center justify-center hover:opacity-70 transition-opacity">
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M1 1L6 6L11 1" stroke="#EB0028" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className={`h-px w-full transition-colors duration-150 ${underlineBg}`} style={underlineStyle} />
      </div>
      {isError && (
        <div className="flex items-center gap-2 w-full mt-[2px]">
          <svg aria-hidden className="shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#eb0028" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#eb0028" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="#eb0028" stroke="#eb0028" strokeWidth="1" />
          </svg>
          <span className="font-helvetica text-xs text-[#eb0028]">{error}</span>
        </div>
      )}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const FORMS_API_BASE = 'https://api.tedxdamascus.sy';

// ─── Utilities ────────────────────────────────────────────────────────────────

export function dateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isoToDate(s: string): Date | null {
  if (!s) return null;
  const parts = s.split('-').map(Number);
  if (parts.length < 3) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export async function submitAnswers(
  formId: string,
  answers: Record<string, unknown>,
): Promise<{ success: boolean; message?: string; isNetworkError?: boolean }> {
  try {
    const res = await fetch(`${FORMS_API_BASE}/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      return { success: false, message: err.message || 'Submission failed', isNetworkError: false };
    }
    return { success: true };
  } catch {
    return { success: false, message: 'Network error. Please try again.', isNetworkError: true };
  }
}

// ─── Date range ───────────────────────────────────────────────────────────────

export type DateRangeValue = { start: string; end: string };

export function DateRangePicker({
  label,
  value,
  onChange,
  error,
}: {
  label?: string;
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <p className="font-helvetica text-base text-[#e0e0e0]">{label}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DatePicker
          label="Start date"
          value={isoToDate(value.start)}
          onChange={(d) => onChange({ ...value, start: d ? dateToIso(d) : '' })}
        />
        <DatePicker
          label="End date"
          value={isoToDate(value.end)}
          onChange={(d) => onChange({ ...value, end: d ? dateToIso(d) : '' })}
        />
      </div>
      {error && (
        <p className="text-xs text-[#eb0028] font-helvetica">{error}</p>
      )}
    </div>
  );
}

// ─── Question renderer ────────────────────────────────────────────────────────

export function QuestionField({
  question,
  value,
  onChange,
  error,
  locale,
  questionNumber,
}: {
  question: ApiQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
  locale: string;
  questionNumber?: number;
}) {
  const lang = locale as 'en' | 'ar';
  const rawTitle = question.title[lang] || question.title.en || question.title.ar || '';
  const prefix = questionNumber != null ? `${questionNumber}. ` : '';
  const titleText = prefix + rawTitle + (question.isRequired ? ' *' : '');
  const helpText =
    question.helpText?.[lang] ||
    question.helpText?.en ||
    question.helpText?.ar;

  const sortedOptions = [...(question.options ?? [])].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  switch (question.type) {
    case 'section':
      return (
        <div className="pt-2 pb-1">
          <h3 className="text-xl font-helvetica text-white font-light">
            {question.title[lang] || question.title.en || question.title.ar}
          </h3>
          {helpText && (
            <p className="text-sm text-[#bebebe] font-helvetica mt-1">
              {helpText}
            </p>
          )}
          <div className="h-px bg-[#2a2a2a] mt-4" />
        </div>
      );

    case 'short_text':
    case 'text':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <TextInput
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'long_text':
    case 'textarea':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">
            {titleText}
          </label>
          <textarea
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
          />
          {error && (
            <p className="text-xs text-[#eb0028] font-helvetica">{error}</p>
          )}
          {helpText && (
            <p className="text-xs text-[#888] font-helvetica">{helpText}</p>
          )}
        </div>
      );

    case 'email':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <TextInput
            type="email"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'phone_number':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <PhoneInput
            label=""
            value={(value as string) ?? ''}
            onChange={(v) => onChange(v)}
            error={error}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'number':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <NumberInput
            label=""
            value={value != null ? String(value) : ''}
            onChange={(v) => onChange(v)}
            error={error}
            min={question.config.min}
            max={question.config.max}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'url':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <TextInput
            type="url"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'single_choice':
      return (
        <div className="flex flex-col gap-2">
          <MultipleChoice
            label={titleText}
            mode="radio"
            options={sortedOptions.map((opt) => ({
              value: opt.id,
              label: opt.label[lang] ?? opt.label.en,
            }))}
            value={(value as string) ?? ''}
            onChange={(v) => onChange(v)}
          />
          {error && (
            <p className="text-xs text-[#eb0028] font-helvetica">{error}</p>
          )}
          {helpText && (
            <p className="text-xs text-[#888] font-helvetica">{helpText}</p>
          )}
        </div>
      );

    case 'checkbox_group':
      return (
        <div className="flex flex-col gap-2">
          <MultipleChoice
            label={titleText}
            mode="checkbox"
            options={sortedOptions.map((opt) => ({
              value: opt.id,
              label: opt.label[lang] ?? opt.label.en,
            }))}
            value={(value as string[]) ?? []}
            onChange={(v) => onChange(v)}
          />
          {error && (
            <p className="text-xs text-[#eb0028] font-helvetica">{error}</p>
          )}
          {helpText && (
            <p className="text-xs text-[#888] font-helvetica">{helpText}</p>
          )}
        </div>
      );

    case 'date':
      return (
        <div className="flex flex-col gap-2">
          <label className="font-helvetica text-base text-[#e0e0e0]">{titleText}</label>
          <DatePicker
            value={isoToDate((value as string) ?? '')}
            onChange={(d) => onChange(d ? dateToIso(d) : null)}
            error={error}
          />
          {helpText && <p className="text-xs text-[#888] font-helvetica">{helpText}</p>}
        </div>
      );

    case 'date_range': {
      const dr = (value as DateRangeValue | null) ?? { start: '', end: '' };
      return (
        <DateRangePicker
          label={titleText}
          value={dr}
          onChange={(v) => onChange(v)}
          error={error}
        />
      );
    }

    case 'rating':
      return (
        <div className="flex flex-col gap-3">
          <p className="font-helvetica text-base text-[#e0e0e0]">{titleText}</p>
          <StarRating
            value={(value as number) ?? 0}
            max={question.config.max ?? 5}
            onChange={(v) => onChange(v)}
          />
          {error && (
            <p className="text-xs text-[#eb0028] font-helvetica">{error}</p>
          )}
          {helpText && (
            <p className="text-xs text-[#888] font-helvetica">{helpText}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
