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
  firstName: string; lastName: string;
  dateOfBirth: Date | null; gender: string;
  email: string; phone: string; city: string;
}

interface Background {
  jobTitle: string; organization: string;
  spokenBefore: string;
  bio: string;
}

interface TalkProposal {
  talkTitle: string;
  talkTopic: string;
  talkLength: string;
  talkSummary: string;
  talkObjective: string;
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
  const t = useTranslations('Forms.speaker');
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
    if (!data.firstName.trim())    e.firstName   = 'First name is required';
    if (!data.lastName.trim())     e.lastName    = 'Last name is required';
    if (!data.dateOfBirth)         e.dateOfBirth = 'Date of birth is required';
    if (!data.gender)              e.gender      = 'Please select a gender';
    if (!data.email.includes('@')) e.email       = 'Please enter a valid email';
    if (!data.phone.trim())        e.phone       = 'Phone number is required';
    if (!data.city)                e.city        = 'Please select a city';
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
  const t = useTranslations('Forms.speaker');
  const [errors, setErrors] = useState<Partial<Record<keyof Background, string>>>({});

  const SPOKEN_BEFORE_OPTIONS = [
    { value: 'yes', label: 'Yes' },
    { value: 'no',  label: 'No'  },
  ];

  const validate = () => {
    const e: typeof errors = {};
    if (!data.jobTitle.trim())     e.jobTitle     = 'Job title is required';
    if (!data.organization.trim()) e.organization = 'Organization is required';
    if (!data.spokenBefore)        e.spokenBefore = 'Please answer this question';
    if (data.bio.trim().length < 20) e.bio        = 'Please write at least 20 characters';
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
        label={t('spokenBefore')}
        mode="radio"
        options={SPOKEN_BEFORE_OPTIONS}
        value={data.spokenBefore}
        onChange={(v) => onChange({ spokenBefore: v as string })}
      />

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">{t('speakerBio')}</label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={5}
          placeholder={t('speakerBioPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.bio && <p className="text-xs text-[#680010]">{errors.bio}</p>}
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

function TalkProposalStep({
  data, onChange, onBack, onSubmit, submitting,
}: {
  data: TalkProposal;
  onChange: (d: Partial<TalkProposal>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.speaker');
  const [errors, setErrors] = useState<Partial<Record<keyof TalkProposal, string>>>({});

  const TALK_TOPIC_OPTIONS = [
    { value: 'technology',      label: t('topicTechnology')      },
    { value: 'science',         label: t('topicScience')         },
    { value: 'arts',            label: t('topicArts')            },
    { value: 'business',        label: t('topicBusiness')        },
    { value: 'entrepreneurship',label: t('topicEntrepreneurship')},
    { value: 'culture',         label: t('topicCulture')         },
    { value: 'health',          label: t('topicHealth')          },
    { value: 'education',       label: t('topicEducation')       },
  ];

  const TALK_LENGTH_OPTIONS = [
    { value: '5',  label: t('length5')  },
    { value: '10', label: t('length10') },
    { value: '15', label: t('length15') },
    { value: '18', label: t('length18') },
  ];

  const validate = () => {
    const e: typeof errors = {};
    if (!data.talkTitle.trim())                     e.talkTitle     = 'Talk title is required';
    if (!data.talkTopic)                            e.talkTopic     = 'Please select a topic';
    if (!data.talkLength)                           e.talkLength    = 'Please select a duration';
    if (data.talkSummary.trim().length < 20)        e.talkSummary   = 'Please elaborate (min 20 characters)';
    if (data.talkObjective.trim().length < 10)      e.talkObjective = 'Please elaborate (min 10 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-helvetica text-white font-light">{t('sectionProposal')}</h2>

      <TextInput
        label={t('talkTitle')}
        value={data.talkTitle}
        onChange={(e) => onChange({ talkTitle: e.target.value })}
        error={errors.talkTitle}
        placeholder={t('talkTitlePlaceholder')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label={t('talkTopic')}
          options={TALK_TOPIC_OPTIONS}
          value={data.talkTopic}
          onChange={(v) => onChange({ talkTopic: v })}
          error={errors.talkTopic}
          placeholder={t('talkTopicPlaceholder')}
        />
        <Select
          label={t('talkLength')}
          options={TALK_LENGTH_OPTIONS}
          value={data.talkLength}
          onChange={(v) => onChange({ talkLength: v })}
          error={errors.talkLength}
          placeholder={t('talkLengthPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">{t('talkSummary')}</label>
        <textarea
          value={data.talkSummary}
          onChange={(e) => onChange({ talkSummary: e.target.value })}
          rows={4}
          placeholder={t('talkSummaryPlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.talkSummary && <p className="text-xs text-[#680010]">{errors.talkSummary}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-helvetica text-base text-[#e0e0e0]">
          {t('talkObjective')}
        </label>
        <textarea
          value={data.talkObjective}
          onChange={(e) => onChange({ talkObjective: e.target.value })}
          rows={4}
          placeholder={t('talkObjectivePlaceholder')}
          className="bg-transparent border-b border-[#525252] focus:border-primary outline-none resize-none font-helvetica text-base text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)] caret-primary py-2 transition-colors"
        />
        {errors.talkObjective && <p className="text-xs text-[#680010]">{errors.talkObjective}</p>}
      </div>

      <FileUpload
        label={t('slidesUpload')}
        accept=".pdf,.ppt,.pptx"
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

export function SpeakerForm({ locale }: { locale: string }) {
  const tF = useTranslations('Forms');
  const t = useTranslations('Forms.speaker');

  const STEPS = [t('step1'), t('step2'), t('step3')];

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '', lastName: '', dateOfBirth: null,
    gender: '', email: '', phone: '', city: '',
  });
  const [background, setBackground] = useState<Background>({
    jobTitle: '', organization: '', spokenBefore: '', bio: '',
  });
  const [proposal, setProposal] = useState<TalkProposal>({
    talkTitle: '', talkTopic: '', talkLength: '',
    talkSummary: '', talkObjective: '',
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
        <FormHero locale={locale} backgroundImage="/images/forms/hero-speaker.png" formType="speaker" title={title} />
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
        backgroundImage="/images/forms/hero-speaker.png"
        formType="speaker"
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
            <BackgroundStep
              data={background}
              onChange={(d) => setBackground((p) => ({ ...p, ...d }))}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <TalkProposalStep
              data={proposal}
              onChange={(d) => setProposal((p) => ({ ...p, ...d }))}
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
