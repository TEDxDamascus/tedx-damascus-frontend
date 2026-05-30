'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { FormHero } from './FormHero';
import { getFormSchema } from '@/lib/api/forms-schema';
import type { ApiFormData } from '@/types/form-schema';
import {
  QuestionField,
  DateRangeValue,
  submitAnswers,
} from './_form-engine';

const FORM_ID = '6a12eba6eb565d20493de36d';

function sanitizeHtml(html: string): string {
  return html
    .replace(/color\s*:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, '')
    .replace(/color\s*:\s*#000(?:000)?\s*;?/gi, '')
    .replace(/color\s*:\s*black\s*;?/gi, '');
}

export function SpeakerForm({ locale }: { locale: string }) {
  const [schema, setSchema] = useState<ApiFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFormSchema(FORM_ID).then((result) => {
      if (result.ok) setSchema(result.schema);
      else
        setFetchError(
          result.reason === 'not_found'
            ? 'Form not found.'
            : 'Failed to load form. Please try again.',
        );
      setLoading(false);
    });
  }, []);

  const updateAnswer = (questionId: string, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const validate = (): boolean => {
    if (!schema) return false;
    const errors: Record<string, string> = {};
    for (const q of schema.questions) {
      if (q.type === 'section') continue;
      const val = answers[q.id];

      // ── Required check ────────────────────────────────────────────────────
      if (q.isRequired) {
        if (val === undefined || val === null || val === '') {
          errors[q.id] = 'هذا الحقل مطلوب';
          continue;
        }
        if (Array.isArray(val) && val.length === 0) {
          errors[q.id] = 'يرجى اختيار خيار واحد على الأقل';
          continue;
        }
        if (q.type === 'date_range') {
          const dr = val as DateRangeValue;
          if (!dr.start || !dr.end) {
            errors[q.id] = 'يرجى تحديد تاريخ البداية والنهاية';
            continue;
          }
        }
      }

      // ── Format checks (run even on optional fields when a value is provided) ──
      if (val === undefined || val === null || val === '') continue;

      if (q.type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string))
          errors[q.id] = 'يرجى إدخال بريد إلكتروني صحيح';
      }

      if (q.type === 'url') {
        try {
          const parsed = new URL(val as string);
          if (!['http:', 'https:'].includes(parsed.protocol))
            errors[q.id] = 'يرجى إدخال رابط يبدأ بـ http أو https';
        } catch {
          errors[q.id] = 'يرجى إدخال رابط صحيح (مثال: https://example.com)';
        }
      }

      if (q.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) {
          errors[q.id] = 'يرجى إدخال رقم صحيح';
        } else if (q.config.min !== undefined && num < q.config.min) {
          errors[q.id] = `يجب أن لا يقل عن ${q.config.min}`;
        } else if (q.config.max !== undefined && num > q.config.max) {
          errors[q.id] = `يجب أن لا يتجاوز ${q.config.max}`;
        }
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !schema) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitAnswers(schema.id, answers);
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setSubmitError(result.message ?? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً.');
  };

  // ── Hero title (static — same on all states) ─────────────────────────────────

  const heroTitle = (
    <div dir="rtl" className="flex flex-wrap items-center justify-center gap-3">
      {/* RTL: DOM order → Arabic text (right), TEDx (middle), Damascus (left) */}
      <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-none whitespace-nowrap">
        طلب تقديم متحدث
      </span>
      <Image
        src="/images/icons/tedx-logo.png"
        alt="TEDx"
        width={140}
        height={85}
        className="object-contain shrink-0"
        style={{ mixBlendMode: 'screen' }}
      />
      <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-none whitespace-nowrap">
        Damascus
      </span>
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <FormHero
          locale={locale}
          backgroundImage="/images/forms/hero-speaker.png"
          formType="speaker"
          title={heroTitle}
        />
        <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
          <div className="w-full max-w-[800px] bg-black px-8 py-14 mt-[-7rem] relative z-10 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#eb0028] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#bebebe] font-helvetica text-sm">Loading…</p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (fetchError || !schema) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <FormHero
          locale={locale}
          backgroundImage="/images/forms/hero-speaker.png"
          formType="speaker"
          title={heroTitle}
        />
        <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
          <div className="w-full max-w-[800px] bg-black px-8 py-14 mt-[-7rem] relative z-10 flex items-center justify-center">
            <p className="text-[#bebebe] font-helvetica">{fetchError ?? 'Form not found.'}</p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  const formName = schema.name.ar || schema.name.en;
  const formDescription = schema.description?.ar || schema.description?.en;
  const sortedQuestions = [...schema.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  // ── Success ──────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <FormHero
          locale={locale}
          backgroundImage="/images/forms/hero-speaker.png"
          formType="speaker"
          title={heroTitle}
        />
        <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
          <div className="w-full max-w-[800px] bg-black px-8 py-14 mt-[-7rem] relative z-10 flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#eb0028]/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-helvetica text-white font-light">تم إرسال الطلب</h2>
            <p className="text-[#bebebe] font-helvetica leading-relaxed max-w-md" dir="rtl">
              شكراً لتقديمك. سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.
            </p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <FormHero
        locale={locale}
        backgroundImage="/images/forms/hero-speaker.png"
        formType="speaker"
        title={heroTitle}
      />

      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div className="w-full max-w-[800px] mt-[-7rem] relative z-10">

          {!showQuestions ? (
            /* ── Step 1: Description card ─────────────────────────────────── */
            <div className="bg-black px-8 py-10 sm:px-12 sm:py-12" dir="rtl">
              <h2 className="font-arabic text-2xl sm:text-3xl text-white font-semibold leading-tight mb-6">
                {formName}
              </h2>
              {formDescription && (
                <div
                  className="
                    font-arabic text-[15px] text-[#bebebe] leading-[1.9]
                    [&_p]:mb-3 [&_p]:text-[#c8c8c8] [&_p]:leading-[1.9]
                    [&_strong]:text-white [&_strong]:font-bold
                    [&_ul]:mt-2 [&_ul]:mb-3 [&_ul]:pe-5 [&_ul]:space-y-1 [&_ul]:list-disc
                    [&_li]:text-[#c8c8c8] [&_li]:leading-[1.9]
                    [&_br]:hidden
                  "
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(formDescription) }}
                />
              )}
              <div className="flex justify-end mt-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestions(true);
                    setTimeout(() => {
                      questionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      const first = questionsRef.current?.querySelector<HTMLElement>('input,textarea,select');
                      first?.focus();
                    }, 50);
                  }}
                  className="border border-[#eb0028] text-[#eb0028] font-arabic text-sm px-10 py-3 hover:bg-[#eb0028]/10 transition-colors"
                >
                  التالي ←
                </button>
              </div>
            </div>
          ) : (
            /* ── Step 2: Questions card ───────────────────────────────────── */
            <div ref={questionsRef} className="bg-black px-8 py-10 sm:px-12 sm:py-12" dir="rtl">
              <div className="flex flex-col gap-10">
                {(() => {
                  // Group consecutive short_text pairs side-by-side; number non-section questions
                  const rows: React.ReactNode[] = [];
                  let qNum = 0;
                  let i = 0;
                  while (i < sortedQuestions.length) {
                    const q = sortedQuestions[i];
                    const next = sortedQuestions[i + 1];
                    if (
                      (q.type === 'short_text' || q.type === 'text') &&
                      next && (next.type === 'short_text' || next.type === 'text')
                    ) {
                      const n1 = ++qNum;
                      const n2 = ++qNum;
                      rows.push(
                        <div key={q.id + next.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <QuestionField question={q} value={answers[q.id]}
                            onChange={(v) => updateAnswer(q.id, v)}
                            error={fieldErrors[q.id]} locale="ar" questionNumber={n1} />
                          <QuestionField question={next} value={answers[next.id]}
                            onChange={(v) => updateAnswer(next.id, v)}
                            error={fieldErrors[next.id]} locale="ar" questionNumber={n2} />
                        </div>
                      );
                      i += 2;
                    } else {
                      if (q.type !== 'section') qNum++;
                      rows.push(
                        <QuestionField key={q.id} question={q} value={answers[q.id]}
                          onChange={(v) => updateAnswer(q.id, v)}
                          error={fieldErrors[q.id]} locale="ar"
                          questionNumber={q.type !== 'section' ? qNum : undefined} />
                      );
                      i++;
                    }
                  }
                  return rows;
                })()}
              </div>

              {submitError && (
                <p className="mt-8 text-sm text-[#eb0028] font-arabic text-right">{submitError}</p>
              )}

              <div className="flex justify-end pt-10">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="border border-[#eb0028] text-[#eb0028] font-arabic text-sm px-10 py-3 hover:bg-[#eb0028]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '...جارٍ الإرسال' : 'إرسال'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer locale={locale} />
    </div>
  );
}
