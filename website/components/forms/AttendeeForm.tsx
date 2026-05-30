'use client';

import { useRef, useState } from 'react';
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
  email: string; phone: string; city: string;
}
interface Background {
  jobTitle: string; organization: string;
  attendedBefore: string; interests: string[]; description: string;
}
interface Questions { whyAttend: string; ideaEnrich: string; }

// ─── Phone input with country code ───────────────────────────────────────────

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

// ─── Step 1: Personal info ────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const num = data.phone.includes(' ') ? data.phone.split(' ').slice(1).join(' ') : '';
    if (!num.trim())                  e.phone       = 'Phone number is required';
    if (!data.city)                   e.city        = 'Please select a city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionPersonal')}</h2>

      {/* Q1 & Q2 — short text side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput label={`1. ${t('firstName')}`} value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })} error={errors.firstName} />
        <TextInput label={`2. ${t('lastName')}`}  value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}  error={errors.lastName} />
      </div>

      {/* Q3 & Q4 — date + gender side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DatePicker label={`3. ${t('dateOfBirth')}`} value={data.dateOfBirth}
          onChange={(d) => onChange({ dateOfBirth: d })} error={errors.dateOfBirth} />
        <div>
          <p className="font-helvetica text-sm text-[#a0a0a0] mb-3">4. {t('gender')}</p>
          <MultipleChoice label="" mode="radio" options={GENDER_OPTIONS}
            value={data.gender} onChange={(v) => onChange({ gender: v as string })} />
          {errors.gender && <p className="text-xs text-[#eb0028] mt-1">{errors.gender}</p>}
        </div>
      </div>

      {/* Q5 & Q6 — email + phone side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput label={`5. ${t('email')}`} type="email" value={data.email}
          onChange={(e) => onChange({ email: e.target.value })} error={errors.email} />
        <PhoneInput label={`6. ${t('phone')}`} value={data.phone}
          onChange={(v) => onChange({ phone: v })} error={errors.phone} />
      </div>

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

      {/* Q1 & Q2 — short text side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput label={`1. ${t('jobTitle')}`}      value={data.jobTitle}
          onChange={(e) => onChange({ jobTitle: e.target.value })}      error={errors.jobTitle} />
        <TextInput label={`2. ${t('organization')}`}  value={data.organization}
          onChange={(e) => onChange({ organization: e.target.value })}  error={errors.organization} />
      </div>

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
          rows={4} placeholder={t('aboutYouPlaceholder')}
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
          rows={4} placeholder={t('whyAttendPlaceholder')} className={textareaClass} />
        {errors.whyAttend && <p className="text-xs text-[#eb0028]">{errors.whyAttend}</p>}
      </div>

      {/* Q2 */}
      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-sm text-[#a0a0a0]">2. {t('ideaEnrich')}</label>
        <textarea value={data.ideaEnrich} onChange={(e) => onChange({ ideaEnrich: e.target.value })}
          rows={4} placeholder={t('ideaEnrichPlaceholder')} className={textareaClass} />
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

  // Scroll the form card into view on every step change
  const cardRef = useRef<HTMLDivElement>(null);
  const goToStep = (n: number) => {
    setStep(n);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const title = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="font-helvetica font-light text-[#f1f1f1] text-2xl sm:text-4xl md:text-[52px] lg:text-[60px] leading-none whitespace-nowrap">
        {t('heroTitle')}
      </span>
      <Image src="/images/icons/tedx-logo.png" alt="TEDx" width={140} height={85}
        className="object-contain shrink-0" style={{ mixBlendMode: 'screen' }} />
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
            <p className="text-[#bebebe] font-helvetica max-w-md">{t('success')}</p>
          </div>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  return (
    <div className="relative bg-[#101010] min-h-screen">
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
