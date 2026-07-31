'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getFormBySlug } from '@/lib/api/forms-schema';
import { translateApiError } from '@/lib/forms-error-i18n';
import type { ApiFormData, ApiQuestion } from '@/types/form-schema';
import {
  QuestionField,
  DateRangeValue,
  submitAnswers,
} from './_form-engine';
import { ROLE_MAP } from './form-role-map';
import { FormErrorPopup } from './FormErrorPopup';
import { FormHero } from './FormHero';
import { StepIndicator } from './StepIndicator';

// Strip inline black/near-black text colors that rich-text editors sometimes
// bake in — invisible against this form's dark background otherwise.
function sanitizeHtml(html: string): string {
  return html
    .replace(/color\s*:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, '')
    .replace(/color\s*:\s*#000(?:000)?\s*;?/gi, '')
    .replace(/color\s*:\s*black\s*;?/gi, '');
}

// A form description from the API may be plain text or rich HTML — detect
// markup so plain text isn't dumped through dangerouslySetInnerHTML unnecessarily.
function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

// ─── Step 1: Description ──────────────────────────────────────────────────────

function DescriptionStep({
  description,
  isAr,
  onNext,
}: {
  description?: string;
  isAr: boolean;
  onNext: () => void;
}) {
  const fallback = isAr
    ? 'يرجى قراءة التفاصيل ثم المتابعة للإجابة عن الأسئلة.'
    : 'Please review the details below, then continue to answer the questions.';

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">
        {isAr ? 'نبذة عن النموذج' : 'About this form'}
      </h2>

      {description && looksLikeHtml(description) ? (
        <div
          className="
            font-helvetica text-base text-[#bebebe] leading-relaxed
            [&_p]:mb-3 [&_p]:text-[#bebebe] [&_p]:leading-relaxed
            [&_a]:text-[#eb0028] [&_a]:underline
            [&_strong]:text-white [&_strong]:font-bold
            [&_ul]:mt-2 [&_ul]:mb-3 [&_ul]:ps-5 [&_ul]:space-y-1 [&_ul]:list-disc
            [&_ol]:mt-2 [&_ol]:mb-3 [&_ol]:ps-5 [&_ol]:space-y-1 [&_ol]:list-decimal
            [&_li]:text-[#bebebe] [&_li]:leading-relaxed
          "
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />
      ) : (
        <p className="font-helvetica text-base text-[#bebebe] leading-relaxed">
          {description || fallback}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {isAr ? 'التالي' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Questions ────────────────────────────────────────────────────────

function QuestionsStep({
  questions,
  answers,
  fieldErrors,
  locale,
  isAr,
  submitting,
  submitError,
  showErrorPopup,
  onChange,
  onBack,
  onSubmit,
}: {
  questions: ApiQuestion[];
  answers: Record<string, unknown>;
  fieldErrors: Record<string, string>;
  locale: string;
  isAr: boolean;
  submitting: boolean;
  submitError: string | null;
  showErrorPopup: boolean;
  onChange: (questionId: string, val: unknown) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">
        {isAr ? 'الأسئلة' : 'Questions'}
      </h2>

      <div className="flex flex-col gap-10">
        {questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => onChange(q.id, v)}
            error={fieldErrors[q.id]}
            locale={locale}
          />
        ))}
      </div>

      {submitError && !showErrorPopup && (
        <p className="text-sm text-[#eb0028] font-helvetica">{submitError}</p>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {isAr ? 'السابق' : 'Previous'}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (isAr ? 'جارٍ الإرسال…' : 'Submitting…') : (isAr ? 'إرسال' : 'Submit')}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GenericApiForm({
  formId,
  locale,
}: {
  formId: string;
  locale: string;
}) {
  const isAr = locale === 'ar';

  const [schema, setSchema] = useState<ApiFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const goToStep = (n: number) => {
    setStep(n);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    getFormBySlug(formId).then((result) => {
      if (result.ok) {
        setSchema(result.schema);
      } else {
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
  }, [formId, isAr]);

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
    if (result.success) {
      setSubmitted(true);
    } else if (result.isNetworkError) {
      const msg = isAr ? 'فشل الإرسال. يرجى المحاولة مرة أخرى.' : 'Submission failed. Please try again.';
      setSubmitError(msg);
      setPopupMessage(msg);
      setShowErrorPopup(true);
    } else {
      const fallback = isAr ? 'فشل الإرسال. يرجى المحاولة مرة أخرى.' : 'Submission failed. Please try again.';
      setSubmitError(result.message ? (isAr ? translateApiError(result.message) : result.message) : fallback);
    }
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
          {!showErrorPopup && (
            <p className="text-[#bebebe] font-helvetica">{fetchError ?? (isAr ? 'النموذج غير موجود.' : 'Form not found.')}</p>
          )}
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
            <h2 className="text-3xl font-helvetica text-white font-light">
              {isAr ? 'تم إرسال الطلب' : 'Application Submitted'}
            </h2>
            <p className="text-[#bebebe] font-helvetica leading-relaxed max-w-md">
              {isAr
                ? 'شكراً لتقديم طلبك. سنقوم بمراجعته والتواصل معك قريباً.'
                : 'Thank you for submitting your application. We will review it and get back to you soon.'}
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

  const STEPS = [isAr ? 'الوصف' : 'Description', isAr ? 'الأسئلة' : 'Questions'];

  const title = (
    <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-tight text-center block">
      {formName}
    </span>
  );

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <FormHero locale={locale} backgroundImage="/images/forms/hero-generic.png" formType="generic" title={title} />

      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div
          ref={cardRef}
          className="w-full max-w-[1100px] bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 sm:px-14 lg:px-20 pt-10 pb-16 mt-[-7rem] relative z-10"
        >
          <StepIndicator steps={STEPS} current={step} />

          {step === 0 && (
            <DescriptionStep
              description={formDescription}
              isAr={isAr}
              onNext={() => goToStep(1)}
            />
          )}

          {step === 1 && (
            <QuestionsStep
              questions={sortedQuestions}
              answers={answers}
              fieldErrors={fieldErrors}
              locale={locale}
              isAr={isAr}
              submitting={submitting}
              submitError={submitError}
              showErrorPopup={showErrorPopup}
              onChange={updateAnswer}
              onBack={() => goToStep(0)}
              onSubmit={handleSubmit}
            />
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
