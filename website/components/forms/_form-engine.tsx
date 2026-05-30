'use client';

import { DatePicker, MultipleChoice, StarRating, TextInput } from '@/components/shared';
import type { ApiQuestion } from '@/types/form-schema';

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
        <p className="text-xs text-[#680010] font-helvetica">{error}</p>
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
}: {
  question: ApiQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
  locale: string;
}) {
  const lang = locale as 'en' | 'ar';
  const titleText =
    (question.title[lang] || question.title.en || question.title.ar || '') +
    (question.isRequired ? ' *' : '');
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
            <p className="text-xs text-[#680010] font-helvetica">{error}</p>
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
        <TextInput
          label={titleText}
          type="tel"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
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
            <p className="text-xs text-[#680010] font-helvetica">{error}</p>
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
            <p className="text-xs text-[#680010] font-helvetica">{error}</p>
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
            <p className="text-xs text-[#680010] font-helvetica">{error}</p>
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
