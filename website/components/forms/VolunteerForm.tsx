'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout/Footer';
import { TextInput, Select, MultipleChoice, FileUpload } from '@/components/shared';
import { FormHero } from './FormHero';
import { StepIndicator } from './StepIndicator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  firstName: string; lastName: string;
  gender: string; email: string;
  phone: string; city: string;
  applyAs: string;
}

interface ExperienceQuestions {
  jobTitle: string; organization: string;
  expertise: string[];
  availability: string;
  whyVolunteer: string;
  relevantExperience: string;
}

// ─── Step components ──────────────────────────────────────────────────────────

function PersonalInfoStep({
  data, onChange, onNext,
}: {
  data: PersonalInfo;
  onChange: (d: Partial<PersonalInfo>) => void;
  onNext: () => void;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.volunteer');
  const tA = useTranslations('Forms.attendee');

  const CITIES = [
    { value: 'damascus',    label: tF('cities.damascus')    },
    { value: 'aleppo',      label: tF('cities.aleppo')      },
    { value: 'homs',        label: tF('cities.homs')        },
    { value: 'hama',        label: tF('cities.hama')        },
    { value: 'latakia',     label: tF('cities.latakia')     },
    { value: 'tartus',      label: tF('cities.tartus')      },
    { value: 'daraa',       label: tF('cities.daraa')       },
    { value: 'as-suwayda',  label: tF('cities.asSuwayda')   },
    { value: 'quneitra',    label: tF('cities.quneitra')    },
    { value: 'deir-ez-zor', label: tF('cities.deirEzZor')  },
  ];

  const GENDER_OPTIONS = [
    { value: 'female',            label: tF('gender.female')        },
    { value: 'male',              label: tF('gender.male')          },
    { value: 'prefer-not-to-say', label: tF('gender.preferNotToSay') },
  ];

  const APPLY_AS_OPTIONS = [
    { value: 'volunteer', label: t('applyAsVolunteer') },
    { value: 'speaker',   label: t('applyAsSpeaker')   },
    { value: 'attendee',  label: t('applyAsAttendee')  },
  ];

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!data.firstName.trim())    e.firstName = 'First name is required';
    if (!data.lastName.trim())     e.lastName  = 'Last name is required';
    if (!data.gender)              e.gender    = 'Please select a gender';
    if (!data.email.includes('@')) e.email     = 'Please enter a valid email';
    if (!data.phone.trim())        e.phone     = 'Phone number is required';
    if (!data.city)                e.city      = 'Please select a city';
    if (!data.applyAs)             e.applyAs   = 'Please select how you want to apply';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionPersonal')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label={tA('firstName')}
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <TextInput
          label={tA('lastName')}
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>

      <MultipleChoice
        label={tA('gender')}
        mode="radio"
        options={GENDER_OPTIONS}
        value={data.gender}
        onChange={(v) => onChange({ gender: v as string })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label={tA('email')}
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          error={errors.email}
        />
        <TextInput
          label={tA('phone')}
          type="tel"
          placeholder="+963 xxxxxxxxx"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <Select
        label={tA('city')}
        options={CITIES}
        value={data.city}
        onChange={(v) => onChange({ city: v })}
        error={errors.city}
        placeholder={tA('cityPlaceholder')}
      />

      <div>
        <MultipleChoice
          label={t('applyAs')}
          mode="radio"
          options={APPLY_AS_OPTIONS}
          value={data.applyAs}
          onChange={(v) => onChange({ applyAs: v as string })}
        />
        {errors.applyAs && <p className="text-xs text-[#680010] mt-1">{errors.applyAs}</p>}
      </div>

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

function ExperienceStep({
  data, onChange, onBack, onSubmit, submitting,
}: {
  data: ExperienceQuestions;
  onChange: (d: Partial<ExperienceQuestions>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.volunteer');

  const EXPERTISE_OPTIONS = [
    { value: 'pr-marketing',           label: t('expertisePr')       },
    { value: 'design-visual-identity', label: t('expertiseDesign')   },
    { value: 'ui-ux',                  label: t('expertiseUiUx')     },
    { value: 'logistics',              label: t('expertiseLogistics') },
    { value: 'content-creation',       label: t('expertiseContent')  },
    { value: 'technical-it',           label: t('expertiseTech')     },
    { value: 'video-editing',          label: t('expertiseVideo')    },
  ];

  const AVAILABILITY_OPTIONS = [
    { value: 'full-time',  label: t('availabilityFullTime')  },
    { value: 'event-only', label: t('availabilityEventOnly') },
    { value: 'remote',     label: t('availabilityRemote')    },
  ];

  const [errors, setErrors] = useState<Partial<Record<keyof ExperienceQuestions, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!data.jobTitle.trim())                  e.jobTitle    = 'Job title is required';
    if (!data.organization.trim())              e.organization = 'Organization is required';
    if (data.expertise.length === 0)            e.expertise   = 'Select at least one area';
    if (!data.availability)                     e.availability = 'Please select your availability';
    if (data.whyVolunteer.trim().length < 10)   e.whyVolunteer = 'Please elaborate (min 10 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionExperience')}</h2>

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
        label={t('expertise')}
        mode="checkbox"
        options={EXPERTISE_OPTIONS}
        value={data.expertise}
        onChange={(v) => onChange({ expertise: v as string[] })}
      />

      <MultipleChoice
        label={t('availability')}
        mode="radio"
        options={AVAILABILITY_OPTIONS}
        value={data.availability}
        onChange={(v) => onChange({ availability: v as string })}
      />

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">
          {t('whyVolunteer')}
        </label>
        <textarea
          value={data.whyVolunteer}
          onChange={(e) => onChange({ whyVolunteer: e.target.value })}
          rows={4}
          placeholder={t('whyVolunteerPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.whyVolunteer && <p className="text-xs text-[#680010]">{errors.whyVolunteer}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">
          {t('relevantExperience')}
        </label>
        <textarea
          value={data.relevantExperience}
          onChange={(e) => onChange({ relevantExperience: e.target.value })}
          rows={4}
          placeholder={t('relevantExperiencePlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
      </div>

      <FileUpload
        label={t('cvUpload')}
        accept=".pdf,.doc,.docx"
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

export function VolunteerForm({ locale }: { locale: string }) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.volunteer');

  const STEPS = [t('step1'), t('step2')];

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '', lastName: '', gender: '',
    email: '', phone: '', city: '', applyAs: '',
  });
  const [experience, setExperience] = useState<ExperienceQuestions>({
    jobTitle: '', organization: '',
    expertise: [], availability: '',
    whyVolunteer: '', relevantExperience: '',
  });

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
        <FormHero locale={locale} backgroundImage="/images/forms/hero-volunteer.png" formType="volunteer" title={title} />
        <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
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
        backgroundImage="/images/forms/hero-volunteer.png"
        formType="volunteer"
        title={title}
      />

      {/* Centered card */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-10 pb-20">
        <div className="w-full max-w-[1100px] bg-[#101010] shadow-[0_8px_40px_rgba(0,0,0,0.7)] px-8 sm:px-14 lg:px-20 pt-10 pb-16 mt-[-7rem] relative z-10">

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
            <ExperienceStep
              data={experience}
              onChange={(d) => setExperience((p) => ({ ...p, ...d }))}
              onBack={() => setStep(0)}
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
