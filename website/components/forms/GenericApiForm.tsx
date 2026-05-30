'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getFormSchema } from '@/lib/api/forms-schema';
import type { ApiFormData } from '@/types/form-schema';
import {
  QuestionField,
  DateRangeValue,
  submitAnswers,
} from './_form-engine';
import { ROLE_MAP } from './form-role-map';

export function GenericApiForm({
  formId,
  locale,
}: {
  formId: string;
  locale: string;
}) {
  const [schema, setSchema] = useState<ApiFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getFormSchema(formId).then((result) => {
      if (result.ok) setSchema(result.schema);
      else
        setFetchError(
          result.reason === 'not_found'
            ? 'Form not found.'
            : 'Failed to load form. Please try again.',
        );
      setLoading(false);
    });
  }, [formId]);

  // If the API returns a known targetRole, delegate to the role-specific form
  const RoleForm = schema?.targetRole ? ROLE_MAP[schema.targetRole] : undefined;
  if (!loading && !fetchError && RoleForm) {
    return <RoleForm locale={locale} />;
  }

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
      if (q.type === 'section' || !q.isRequired) continue;
      const val = answers[q.id];
      if (val === undefined || val === null || val === '') {
        errors[q.id] = 'This field is required';
      } else if (Array.isArray(val) && val.length === 0) {
        errors[q.id] = 'Please select at least one option';
      } else if (q.type === 'date_range') {
        const dr = val as DateRangeValue;
        if (!dr.start || !dr.end)
          errors[q.id] = 'Please select both start and end dates';
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
    else setSubmitError(result.message ?? 'Submission failed. Please try again.');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <Navbar locale={locale} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#eb0028] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#bebebe] font-helvetica text-sm">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (fetchError || !schema) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <Navbar locale={locale} />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[#bebebe] font-helvetica">{fetchError ?? 'Form not found.'}</p>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  const lang = locale as 'en' | 'ar';
  const formName = schema.name[lang] ?? schema.name.en;
  const formDescription = schema.description?.[lang] ?? schema.description?.en;

  // ── Success ──────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <Navbar locale={locale} />
        <div className="flex justify-center px-4 sm:px-6 lg:px-10 pt-28 pb-20">
          <div className="w-full max-w-[800px] bg-black p-12 flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#eb0028]/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-helvetica text-white font-light">Application Submitted</h2>
            <p className="text-[#bebebe] font-helvetica leading-relaxed max-w-md">
              Thank you for submitting your application. We will review it and get back to you soon.
            </p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  const sortedQuestions = [...schema.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <Navbar locale={locale} />

      <div className="pt-20 px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">

          {/* Description card */}
          <div className="bg-black px-8 py-10 sm:px-12 sm:py-12">
            <Image
              src="/images/icons/tedx-logo.png"
              alt="TEDx"
              width={90}
              height={52}
              className="object-contain mb-7"
              style={{ mixBlendMode: 'screen' }}
            />
            <h1 className="font-helvetica text-3xl sm:text-[40px] text-white font-light leading-tight">
              {formName}
            </h1>
            {formDescription && (
              <p className="font-helvetica text-base text-[#bebebe] leading-relaxed mt-4">
                {formDescription}
              </p>
            )}
          </div>

          {/* Questions card */}
          <div className="bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-col gap-10">
              {sortedQuestions.map((q) => (
                <QuestionField
                  key={q.id}
                  question={q}
                  value={answers[q.id]}
                  onChange={(v) => updateAnswer(q.id, v)}
                  error={fieldErrors[q.id]}
                  locale={locale}
                />
              ))}
            </div>

            {submitError && (
              <p className="mt-8 text-sm text-[#eb0028] font-helvetica">{submitError}</p>
            )}

            <div className="flex justify-end pt-10">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-10 py-3 hover:bg-[#eb0028]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer locale={locale} />
    </div>
  );
}
