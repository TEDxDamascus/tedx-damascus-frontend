'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { FormHero } from './FormHero';
import { getFormSchema } from '@/lib/api/forms-schema';
import { translateApiError } from '@/lib/forms-error-i18n';
import type { ApiFormData } from '@/types/form-schema';
import {
  QuestionField,
  DateRangeValue,
  submitAnswers,
} from './_form-engine';
import { LeaveGuardDialog } from './LeaveGuardDialog';
import { FormErrorPopup } from './FormErrorPopup';

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
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const questionsRef    = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFormSchema(FORM_ID).then((result) => {
      if (result.ok) {
        setSchema(result.schema);
      } else {
        const isAr = locale === 'ar';
        const msg = result.reason === 'not_found'
          ? (isAr ? 'النموذج غير موجود.' : 'Form not found.')
          : (isAr ? 'فشل تحميل النموذج. يرجى المحاولة مرة أخرى.' : 'Failed to load form. Please try again.');
        setFetchError(msg);
        if (result.reason !== 'not_found') {
          setPopupMessage(msg);
          setShowErrorPopup(true);
        }
      }
      setLoading(false);
    });
  }, [locale]);

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
    for (const q of (schema.questions ?? [])) {
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

      if (q.type === 'phone_number') {
        const digits = (val as string).replace(/^\+963\s*/, '').replace(/\s/g, '');
        if (!/^\d{9,10}$/.test(digits))
          errors[q.id] = 'رقم الهاتف غير صالح. يرجى إدخال 9 أو 10 أرقام بعد رمز +963';
      }

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
    if (result.success) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (result.isNetworkError) {
      const msg = locale === 'ar' ? 'فشل الإرسال. يرجى المحاولة مرة أخرى.' : 'Submission failed. Please try again.';
      setSubmitError(msg);
      setPopupMessage(msg);
      setShowErrorPopup(true);
    } else {
      setSubmitError(translateApiError(result.message ?? ''));
    }
  };

  // ── Loading — show only spinner, no title text ───────────────────────────────

  if (loading) {
    return (
      <div className="bg-[#101010] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (fetchError || !schema) {
    return (
      <div className="bg-[#101010] min-h-screen flex items-center justify-center px-6 text-center">
        {!showErrorPopup && (
          <p className="text-[#bebebe] font-helvetica">{fetchError ?? (locale === 'ar' ? 'النموذج غير موجود.' : 'Form not found.')}</p>
        )}
        <FormErrorPopup
          isOpen={showErrorPopup}
          onClose={() => setShowErrorPopup(false)}
          message={popupMessage}
          locale={locale}
        />
      </div>
    );
  }

  // Schema is guaranteed non-null beyond this point
  const formDescription = schema.description?.ar || schema.description?.en;
  const sortedQuestions = [...(schema.questions ?? [])].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  // heroTitle only rendered when we have the real form name from the API
  const heroTitle = (
    <span
      className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-tight text-center block"
      dir="rtl"
    >
      {schema.name?.ar || schema.name?.en}
    </span>
  );

  // ── Success ──────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-[#101010] min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-[#EB0028]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EB0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="flex flex-col gap-3 max-w-lg">
          <h2 className="text-3xl font-arabic text-white font-light">تم إرسال الطلب</h2>
          <p className="text-[#bebebe] font-arabic leading-relaxed">
            شكراً لتقديمك. سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.
          </p>
        </div>
        <div className="w-12 h-0.5 bg-[#EB0028]" />
        <Link
          href={`/${locale}/home`}
          className="border border-[#EB0028] text-[#EB0028] font-arabic text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#EB0028]/10 transition-colors"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  const isDirty = showQuestions || Object.keys(answers).some((k) => {
    const v = answers[k];
    return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
  });

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <LeaveGuardDialog isDirty={isDirty} locale={locale} />
      <FormHero
        locale={locale}
        backgroundImage="/images/forms/hero-speaker.jpg"
        formType="speaker"
        title={heroTitle}
      />

      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div ref={cardContainerRef} className="w-full max-w-[800px] mt-[-7rem] relative z-10">

          {!showQuestions ? (
            /* ── Step 1: Description card ─────────────────────────────────── */
            <div className="bg-black px-8 py-10 sm:px-12 sm:py-12" dir="rtl">
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
                  const rows: React.ReactNode[] = [];
                  let qNum = 0;
                  for (let i = 0; i < sortedQuestions.length; i++) {
                    const q = sortedQuestions[i];
                    if (q.type !== 'section') qNum++;
                    rows.push(
                      <QuestionField key={q.id} question={q} value={answers[q.id]}
                        onChange={(v) => updateAnswer(q.id, v)}
                        error={fieldErrors[q.id]} locale="ar"
                        questionNumber={q.type !== 'section' ? qNum : undefined} />
                    );
                  }
                  return rows;
                })()}
              </div>

              {submitError && !showErrorPopup && (
                <p className="mt-8 text-sm text-[#eb0028] font-arabic text-right">{submitError}</p>
              )}

              <div className="flex justify-between pt-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestions(false);
                    setTimeout(() => {
                      cardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className="border border-[#eb0028] text-[#eb0028] font-arabic text-sm px-10 py-3 hover:bg-[#eb0028]/10 transition-colors"
                >
                  → السابق
                </button>
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

      <FormErrorPopup
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        message={popupMessage}
        locale={locale}
      />
    </div>
  );
}
