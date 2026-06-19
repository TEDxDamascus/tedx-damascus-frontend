'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout/Footer';
import { TextInput, Select, MultipleChoice, DatePicker, FileUpload } from '@/components/shared';
import { FormHero } from './FormHero';
import { StepIndicator } from './StepIndicator';
import { LeaveGuardDialog } from './LeaveGuardDialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  firstName: string;  lastName: string;
  dateOfBirth: Date | null; gender: string;
  email: string; phone: string; city: string;
}
interface Background {
  jobTitle: string; organization: string;
  attendedBefore: string; interests: string[]; description: string;
}
interface Questions { whyAttend: string; ideaEnrich: string; }

// ─── Phone input with country code ───────────────────────────────────────────

// Inline Syrian flag — shown as the default country indicator
function SyrianFlagIcon() {
  return (
    <div className="w-6 h-[17px] relative overflow-hidden shrink-0 rounded-[1px] select-none" aria-hidden>
      {/* Green stripe */}
      <div className="absolute inset-x-0 h-[5.67px] bg-[#007A3D]" style={{ top: 0 }} />
      {/* White stripe */}
      <div className="absolute inset-x-0 h-[5.66px] bg-[#F1F1F1]" style={{ top: 5.67 }} />
      {/* Black stripe */}
      <div className="absolute inset-x-0 h-[5.67px] bg-[#101010]" style={{ top: 11.33 }} />
      {/* Three red stars */}
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
    return v.trim().replace(/^\+963\s*/, '');
  };
  const [number,    setNumber]    = useState(parseNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  const update = (n: string) => onChange(n.trim() ? `+963${n}` : '');

  const isError = !!error;

  const underlineBg    = isError ? 'bg-[#eb0028]' : isFocused ? 'bg-[#eb0028]' : 'bg-[#525252]';
  const underlineStyle = isFocused && !isError
    ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' }
    : undefined;

  return (
    <div className="flex flex-col gap-[2px] items-start w-full">
      <div className="relative w-full">
        {label && (
          <label className="absolute start-[10px] top-[3px] text-[10px] leading-none text-[#E0E0E0] pointer-events-none select-none font-helvetica">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 w-full ps-[10px] pe-[10px] pt-[18px] pb-[6px] overflow-hidden">
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

// ─── Step 1: Personal info ────────────────────────────────────────────────────

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function PersonalInfoStep({ data, onChange, onNext }: {
  data: PersonalInfo;
  onChange: (d: Partial<PersonalInfo>) => void;
  onNext: () => void;
}) {
  const tF = useTranslations('Forms');
  const t  = useTranslations('Forms.attendee');
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
    if (!data.firstName.trim())       e.firstName   = 'First name is required';
    if (!data.lastName.trim())        e.lastName    = 'Last name is required';
    if (!data.dateOfBirth)            e.dateOfBirth = 'Date of birth is required';
    if (!data.gender)                 e.gender      = 'Please select a gender';
    if (!EMAIL_RE.test(data.email))   e.email       = 'Please enter a valid email address';
    const num = data.phone.replace(/^\+963\s*/, '').trim();
    if (!num || !/^\d{9,10}$/.test(num)) e.phone   = 'Phone number is required';
    if (!data.city)                   e.city        = 'Please select a city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionPersonal')}</h2>

      <TextInput label={`1. ${t('firstName')}`} value={data.firstName} maxLength={50}
        onChange={(e) => onChange({ firstName: e.target.value })} error={errors.firstName} />

      <TextInput label={`2. ${t('lastName')}`} value={data.lastName} maxLength={50}
        onChange={(e) => onChange({ lastName: e.target.value })} error={errors.lastName} />

      <DatePicker label={`3. ${t('dateOfBirth')}`} value={data.dateOfBirth}
        onChange={(d) => onChange({ dateOfBirth: d })} error={errors.dateOfBirth} />

      <div>
        <p className="font-helvetica text-sm text-[#a0a0a0] mb-3">4. {t('gender')}</p>
        <MultipleChoice label="" mode="radio" options={GENDER_OPTIONS}
          value={data.gender} onChange={(v) => onChange({ gender: v as string })} />
        {errors.gender && <p className="text-xs text-[#eb0028] mt-1">{errors.gender}</p>}
      </div>

      <TextInput label={`5. ${t('email')}`} type="email" value={data.email} maxLength={100}
        onChange={(e) => onChange({ email: e.target.value })} error={errors.email} />

      <PhoneInput label={`6. ${t('phone')}`} value={data.phone}
        onChange={(v) => onChange({ phone: v })} error={errors.phone} />

      {/* Q7 — city */}
      <Select label={`7. ${t('city')}`} options={CITIES} value={data.city}
        onChange={(v) => onChange({ city: v })} error={errors.city}
        placeholder={t('cityPlaceholder')} />

      <div className="flex justify-end pt-4">
        <button type="button" onClick={() => validate() && onNext()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors">
          {tF('next')}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Background ───────────────────────────────────────────────────────

function BackgroundStep({ data, onChange, onNext, onBack }: {
  data: Background;
  onChange: (d: Partial<Background>) => void;
  onNext: () => void; onBack: () => void;
}) {
  const tF = useTranslations('Forms');
  const t  = useTranslations('Forms.attendee');
  const [errors, setErrors] = useState<Partial<Record<keyof Background, string>>>({});

  const INTEREST_OPTIONS = [
    { value: 'technology',       label: t('technology')       },
    { value: 'business',         label: t('business')         },
    { value: 'arts',             label: t('arts')             },
    { value: 'entrepreneurship', label: t('entrepreneurship') },
    { value: 'science',          label: t('science')          },
    { value: 'culture',          label: t('culture')          },
    { value: 'health',           label: t('health')           },
  ];

  const ATTENDED_OPTIONS = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

  const validate = () => {
    const e: typeof errors = {};
    if (!data.jobTitle.trim())       e.jobTitle       = 'Job title is required';
    if (!data.organization.trim())   e.organization   = 'Organization is required';
    if (!data.attendedBefore)        e.attendedBefore = 'Please answer this question';
    if (data.interests.length === 0) e.interests      = 'Select at least one area';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionBackground')}</h2>

      <TextInput label={`1. ${t('jobTitle')}`} value={data.jobTitle} maxLength={100}
        onChange={(e) => onChange({ jobTitle: e.target.value })} error={errors.jobTitle} />

      <TextInput label={`2. ${t('organization')}`} value={data.organization} maxLength={100}
        onChange={(e) => onChange({ organization: e.target.value })} error={errors.organization} />

      {/* Q3 — attended before */}
      <div>
        <p className="font-helvetica text-sm text-[#a0a0a0] mb-3">3. {t('attendedBefore')}</p>
        <MultipleChoice label="" mode="radio" options={ATTENDED_OPTIONS}
          value={data.attendedBefore} onChange={(v) => onChange({ attendedBefore: v as string })} />
        {errors.attendedBefore && <p className="text-xs text-[#eb0028] mt-1">{errors.attendedBefore}</p>}
      </div>

      {/* Q4 — interests */}
      <div>
        <p className="font-helvetica text-sm text-[#a0a0a0] mb-3">4. {t('interests')}</p>
        <MultipleChoice label="" mode="checkbox" options={INTEREST_OPTIONS}
          value={data.interests} onChange={(v) => onChange({ interests: v as string[] })} />
        {errors.interests && <p className="text-xs text-[#eb0028] mt-1">{errors.interests}</p>}
      </div>

      {/* Q5 — about you */}
      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-sm text-[#a0a0a0]">5. {t('aboutYou')}</label>
        <textarea value={data.description} onChange={(e) => onChange({ description: e.target.value })}
          rows={4} maxLength={500} placeholder={t('aboutYouPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-[#eb0028] py-2 transition-colors" />
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors">
          {tF('previous')}
        </button>
        <button type="button" onClick={() => validate() && onNext()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors">
          {tF('next')}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Questions ────────────────────────────────────────────────────────

function QuestionsStep({ data, onChange, onBack, onSubmit, submitting }: {
  data: Questions;
  onChange: (d: Partial<Questions>) => void;
  onBack: () => void; onSubmit: () => void; submitting: boolean;
}) {
  const tF = useTranslations('Forms');
  const t  = useTranslations('Forms.attendee');
  const [errors, setErrors] = useState<Partial<Record<keyof Questions, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (data.whyAttend.trim().length  < 10) e.whyAttend  = 'Please elaborate (min 10 characters)';
    if (data.ideaEnrich.trim().length < 10) e.ideaEnrich = 'Please elaborate (min 10 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const textareaClass = 'bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-[#eb0028] py-2 transition-colors';

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionQuestions')}</h2>

      {/* Q1 */}
      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-sm text-[#a0a0a0]">1. {t('whyAttend')}</label>
        <textarea value={data.whyAttend} onChange={(e) => onChange({ whyAttend: e.target.value })}
          rows={4} maxLength={800} placeholder={t('whyAttendPlaceholder')} className={textareaClass} />
        {errors.whyAttend && <p className="text-xs text-[#eb0028]">{errors.whyAttend}</p>}
      </div>

      {/* Q2 */}
      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-sm text-[#a0a0a0]">2. {t('ideaEnrich')}</label>
        <textarea value={data.ideaEnrich} onChange={(e) => onChange({ ideaEnrich: e.target.value })}
          rows={4} maxLength={800} placeholder={t('ideaEnrichPlaceholder')} className={textareaClass} />
        {errors.ideaEnrich && <p className="text-xs text-[#eb0028]">{errors.ideaEnrich}</p>}
      </div>

      {/* Q3 — ID upload */}
      <div>
        <p className="font-helvetica text-sm text-[#a0a0a0] mb-3">3. {t('idUpload')}</p>
        <FileUpload label="" accept=".pdf,.jpg,.jpeg,.png" onFileChange={() => {}} />
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors">
          {tF('previous')}
        </button>
        <button type="button" disabled={submitting} onClick={() => validate() && onSubmit()}
          className="border border-[#eb0028] text-[#eb0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#eb0028]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? tF('submitting') : tF('submit')}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AttendeeForm({ locale }: { locale: string }) {
  const tF = useTranslations('Forms');
  const t  = useTranslations('Forms.attendee');

  const STEPS = [t('step1'), t('step2'), t('step3')];

  const [step,       setStep]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const [personal,   setPersonal]   = useState<PersonalInfo>({ firstName: '', lastName: '', dateOfBirth: null, gender: '', email: '', phone: '', city: '' });
  const [background, setBackground] = useState<Background>({ jobTitle: '', organization: '', attendedBefore: '', interests: [], description: '' });
  const [questions,  setQuestions]  = useState<Questions>({ whyAttend: '', ideaEnrich: '' });

  const cardRef = useRef<HTMLDivElement>(null);
  const goToStep = (n: number) => {
    setStep(n);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = (
    <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-tight text-center block">
      {t('heroTitle')}
    </span>
  );

  const isDirty = !!(
    personal.firstName || personal.lastName || personal.email || personal.phone ||
    personal.gender || personal.city || personal.dateOfBirth ||
    background.jobTitle || background.organization || background.attendedBefore ||
    background.interests.length > 0 || background.description ||
    questions.whyAttend || questions.ideaEnrich
  );

  if (submitted) {
    return (
      <div className="bg-[#101010] min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="w-20 h-20 rounded-full bg-[#EB0028]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EB0028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="flex flex-col gap-3 max-w-lg">
          <h2 className="text-3xl font-helvetica text-white font-light">{tF('submitted')}</h2>
          <p className="text-[#bebebe] font-helvetica leading-relaxed">{t('success')}</p>
        </div>
        <div className="w-12 h-0.5 bg-[#EB0028]" />
        <Link
          href={`/${locale}/home`}
          className="border border-[#EB0028] text-[#EB0028] font-helvetica text-sm uppercase tracking-wider px-8 py-3 hover:bg-[#EB0028]/10 transition-colors"
        >
          {tF('backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative bg-[#101010] min-h-screen">
      <LeaveGuardDialog isDirty={isDirty} locale={locale} />
      <FormHero locale={locale} backgroundImage="/images/forms/hero-attendee.png" formType="attendee" title={title} />

      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div
          ref={cardRef}
          className="w-full max-w-[1100px] bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 sm:px-14 lg:px-20 pt-10 pb-16 mt-[-7rem] relative z-10"
        >
          <StepIndicator steps={STEPS} current={step} />

          <p className="font-helvetica text-sm text-[#bebebe] mb-8">
            <span className="text-primary font-bold">{t('welcome')}</span>{' '}
            {t('welcomeText')}
          </p>

          {step === 0 && (
            <PersonalInfoStep
              data={personal}
              onChange={(d) => setPersonal((p) => ({ ...p, ...d }))}
              onNext={() => goToStep(1)}
            />
          )}
          {step === 1 && (
            <BackgroundStep
              data={background}
              onChange={(d) => setBackground((p) => ({ ...p, ...d }))}
              onNext={() => goToStep(2)}
              onBack={() => goToStep(0)}
            />
          )}
          {step === 2 && (
            <QuestionsStep
              data={questions}
              onChange={(d) => setQuestions((p) => ({ ...p, ...d }))}
              onBack={() => goToStep(1)}
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
