'use client';

import { useState } from 'react';
import { DatePicker, MultipleChoice, StarRating, TextInput } from '@/components/shared';
import type { ApiQuestion } from '@/types/form-schema';

// ─── Phone input with country code ────────────────────────────────────────────

const COUNTRY_CODES = [
  { label: '+963 SY', value: '+963' },
  { label: '+1 US',   value: '+1'   },
  { label: '+44 GB',  value: '+44'  },
  { label: '+966 SA', value: '+966' },
  { label: '+971 AE', value: '+971' },
  { label: '+961 LB', value: '+961' },
  { label: '+962 JO', value: '+962' },
  { label: '+20 EG',  value: '+20'  },
  { label: '+90 TR',  value: '+90'  },
  { label: '+49 DE',  value: '+49'  },
  { label: '+33 FR',  value: '+33'  },
  { label: '+7 RU',   value: '+7'   },
];

function PhoneInput({ label, value, onChange, error }: {
  label: string; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  const parseValue = (v: string) => {
    if (!v.trim()) return { code: '+963', number: '' };
    const parts = v.trim().split(' ');
    return parts.length > 1 && parts[0].startsWith('+')
      ? { code: parts[0], number: parts.slice(1).join(' ') }
      : { code: '+963', number: v };
  };
  const { code: ic, number: iNum } = parseValue(value);
  const [code,   setCode]   = useState(ic);
  const [number, setNumber] = useState(iNum);

  const update = (c: string, n: string) => onChange(n.trim() ? `${c} ${n}` : c);

  return (
    <div className="flex flex-col gap-1">
      <label className="font-helvetica text-sm text-[#a0a0a0] mb-1">{label}</label>
      <div className={`flex items-center gap-3 border-b pb-1 transition-colors ${error ? 'border-[#eb0028]' : 'border-[#525252] focus-within:border-[#eb0028]'}`}>
        <select
          value={code}
          onChange={(e) => { setCode(e.target.value); update(e.target.value, number); }}
          className="bg-transparent text-[#bebebe] font-helvetica text-sm outline-none cursor-pointer shrink-0 py-1"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#1a1a1a] text-white">{c.label}</option>
          ))}
        </select>
        <span className="text-[#525252] select-none">|</span>
        <input
          type="tel"
          value={number}
          onChange={(e) => { setNumber(e.target.value); update(code, e.target.value); }}
          placeholder="xxxxxxxxx"
          className="flex-1 bg-transparent text-[#bebebe] font-helvetica text-base outline-none placeholder:text-[rgba(255,255,255,0.3)] py-1 caret-[#eb0028]"
        />
      </div>
      {error && <p className="text-xs text-[#eb0028] mt-1">{error}</p>}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const FORMS_API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORMS_API_URL) ||
  '/api';

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
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${FORMS_API_BASE}/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      return { success: false, message: err.message || 'Submission failed' };
    }
    return { success: true };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
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
        <TextInput
          label={titleText}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
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
        <TextInput
          label={titleText}
          type="email"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );

    case 'phone_number':
      return (
        <PhoneInput
          label={titleText}
          value={(value as string) ?? ''}
          onChange={(v) => onChange(v)}
          error={error}
        />
      );

    case 'number':
      return (
        <TextInput
          label={titleText}
          type="number"
          value={value != null ? String(value) : ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          error={error}
        />
      );

    case 'url':
      return (
        <TextInput
          label={titleText}
          type="url"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
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
        <DatePicker
          label={titleText}
          value={isoToDate((value as string) ?? '')}
          onChange={(d) => onChange(d ? dateToIso(d) : null)}
          error={error}
        />
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
