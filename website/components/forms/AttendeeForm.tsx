'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout/Footer';
import { TextInput, Select, MultipleChoice, DatePicker, FileUpload } from '@/components/shared';
import { FormHero } from './FormHero';
import { StepIndicator } from './StepIndicator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  firstName: string;  lastName: string;
  dateOfBirth: Date | null; gender: string;
  email: string;      phone: string;  city: string;
}

interface Background {
  jobTitle: string;       organization: string;
  attendedBefore: string; interests: string[];
  description: string;
}

interface Questions {
  whyAttend: string;  ideaEnrich: string;
}

// ─── Sub-step components ──────────────────────────────────────────────────────

function PersonalInfoStep({
  data, onChange, onNext,
}: {
  data: PersonalInfo;
  onChange: (d: Partial<PersonalInfo>) => void;
  onNext: () => void;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.attendee');
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});

  const CITIES = [
    { value: 'damascus',    label: tF('cities.damascus')   },
    { value: 'aleppo',      label: tF('cities.aleppo')     },
    { value: 'homs',        label: tF('cities.homs')       },
    { value: 'hama',        label: tF('cities.hama')       },
    { value: 'latakia',     label: tF('cities.latakia')    },
    { value: 'tartus',      label: tF('cities.tartus')     },
    { value: 'daraa',       label: tF('cities.daraa')      },
    { value: 'as-suwayda',  label: tF('cities.asSuwayda')  },
    { value: 'quneitra',    label: tF('cities.quneitra')   },
    { value: 'deir-ez-zor', label: tF('cities.deirEzZor')  },
  ];

  const GENDER_OPTIONS = [
    { value: 'female',            label: tF('gender.female')         },
    { value: 'male',              label: tF('gender.male')           },
    { value: 'prefer-not-to-say', label: tF('gender.preferNotToSay') },
  ];

  const validate = () => {
    const e: typeof errors = {};
    if (!data.firstName.trim())  e.firstName  = 'First name is required';
    if (!data.lastName.trim())   e.lastName   = 'Last name is required';
    if (!data.dateOfBirth)       e.dateOfBirth = 'Date of birth is required';
    if (!data.gender)            e.gender     = 'Please select a gender';
    if (!data.email.includes('@')) e.email    = 'Please enter a valid email';
    if (!data.phone.trim())      e.phone      = 'Phone number is required';
    if (!data.city)              e.city       = 'Please select a city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionPersonal')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label={t('firstName')}
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <TextInput
          label={t('lastName')}
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DatePicker
          label={t('dateOfBirth')}
          value={data.dateOfBirth}
          onChange={(d) => onChange({ dateOfBirth: d })}
          error={errors.dateOfBirth}
        />
        <MultipleChoice
          label={t('gender')}
          mode="radio"
          options={GENDER_OPTIONS}
          value={data.gender}
          onChange={(v) => onChange({ gender: v as string })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label={t('email')}
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          error={errors.email}
        />
        <TextInput
          label={t('phone')}
          type="tel"
          placeholder="+963 xxxxxxxxx"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <Select
        label={t('city')}
        options={CITIES}
        value={data.city}
        onChange={(v) => onChange({ city: v })}
        error={errors.city}
        placeholder={t('cityPlaceholder')}
      />

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => validate() && onNext()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {tF('next')}
        </button>
      </div>
    </div>
  );
}

function BackgroundStep({
  data, onChange, onNext, onBack,
}: {
  data: Background;
  onChange: (d: Partial<Background>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.attendee');
  const [errors, setErrors] = useState<Partial<Record<keyof Background, string>>>({});

  const INTEREST_OPTIONS = [
    { value: 'technology',      label: t('technology')      },
    { value: 'business',        label: t('business')        },
    { value: 'arts',            label: t('arts')            },
    { value: 'entrepreneurship',label: t('entrepreneurship')},
    { value: 'science',         label: t('science')         },
    { value: 'culture',         label: t('culture')         },
    { value: 'health',          label: t('health')          },
  ];

  const ATTENDED_OPTIONS = [
    { value: 'yes', label: 'Yes' },
    { value: 'no',  label: 'No'  },
  ];

  const validate = () => {
    const e: typeof errors = {};
    if (!data.jobTitle.trim())    e.jobTitle    = 'Job title is required';
    if (!data.organization.trim()) e.organization = 'Organization is required';
    if (!data.attendedBefore)     e.attendedBefore = 'Please answer this question';
    if (data.interests.length === 0) e.interests = 'Select at least one area';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionBackground')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label={t('jobTitle')}
          value={data.jobTitle}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
          error={errors.jobTitle}
        />
        <TextInput
          label={t('organization')}
          value={data.organization}
          onChange={(e) => onChange({ organization: e.target.value })}
          error={errors.organization}
        />
      </div>

      <MultipleChoice
        label={t('attendedBefore')}
        mode="radio"
        options={ATTENDED_OPTIONS}
        value={data.attendedBefore}
        onChange={(v) => onChange({ attendedBefore: v as string })}
      />

      <MultipleChoice
        label={t('interests')}
        mode="checkbox"
        options={INTEREST_OPTIONS}
        value={data.interests}
        onChange={(v) => onChange({ interests: v as string[] })}
      />

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">{t('aboutYou')}</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          placeholder={t('aboutYouPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {tF('previous')}
        </button>
        <button
          type="button"
          onClick={() => validate() && onNext()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {tF('next')}
        </button>
      </div>
    </div>
  );
}

function QuestionsStep({
  data, onChange, onBack, onSubmit, submitting,
}: {
  data: Questions;
  onChange: (d: Partial<Questions>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.attendee');
  const [errors, setErrors] = useState<Partial<Record<keyof Questions, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (data.whyAttend.trim().length < 10)  e.whyAttend  = 'Please elaborate (min 10 characters)';
    if (data.ideaEnrich.trim().length < 10) e.ideaEnrich = 'Please elaborate (min 10 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionQuestions')}</h2>

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">
          {t('whyAttend')}
        </label>
        <textarea
          value={data.whyAttend}
          onChange={(e) => onChange({ whyAttend: e.target.value })}
          rows={4}
          placeholder={t('whyAttendPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.whyAttend && <p className="text-xs text-[#680010]">{errors.whyAttend}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">
          {t('ideaEnrich')}
        </label>
        <textarea
          value={data.ideaEnrich}
          onChange={(e) => onChange({ ideaEnrich: e.target.value })}
          rows={4}
          placeholder={t('ideaEnrichPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.ideaEnrich && <p className="text-xs text-[#680010]">{errors.ideaEnrich}</p>}
      </div>

      <FileUpload
        label={t('idUpload')}
        accept=".pdf,.jpg,.jpeg,.png"
        onFileChange={() => {}}
      />

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors"
        >
          {tF('previous')}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => validate() && onSubmit()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? tF('submitting') : tF('submit')}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AttendeeForm({ locale }: { locale: string }) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.attendee');

  const STEPS = [t('step1'), t('step2'), t('step3')];

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '', lastName: '', dateOfBirth: null,
    gender: '', email: '', phone: '', city: '',
  });
  const [background, setBackground] = useState<Background>({
    jobTitle: '', organization: '', attendedBefore: '',
    interests: [], description: '',
  });
  const [questions, setQuestions] = useState<Questions>({
    whyAttend: '', ideaEnrich: '',
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const title = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-none whitespace-nowrap">
        {t('heroTitle')}
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

  if (submitted) {
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <FormHero locale={locale} backgroundImage="/images/forms/hero-attendee.png" formType="attendee" title={title} />
        <div className="flex justify-center px-4 pb-20">
          <div className="w-full max-w-[1100px] bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 sm:px-14 lg:px-20 py-16 mt-[-7rem] relative z-10 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eb0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 className="text-3xl font-helvetica text-white">{tF('submitted')}</h2>
            <p className="text-[#bebebe] font-helvetica max-w-md">
              {t('success')}
            </p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <FormHero
        locale={locale}
        backgroundImage="/images/forms/hero-attendee.png"
        formType="attendee"
        title={title}
      />

      {/* Centered card */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div className="w-full max-w-[1100px] bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 sm:px-14 lg:px-20 pt-10 pb-16 mt-[-7rem] relative z-10">

          {/* TEDx logo */}
          <StepIndicator steps={STEPS} current={step} />

          <p className="font-helvetica text-sm text-[#bebebe] mb-8">
            <span className="text-primary font-bold">{t('welcome')}</span>{' '}
            {t('welcomeText')}
          </p>

          {step === 0 && (
            <PersonalInfoStep
              data={personal}
              onChange={(d) => setPersonal((p) => ({ ...p, ...d }))}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <BackgroundStep
              data={background}
              onChange={(d) => setBackground((p) => ({ ...p, ...d }))}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <QuestionsStep
              data={questions}
              onChange={(d) => setQuestions((p) => ({ ...p, ...d }))}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  );
}
