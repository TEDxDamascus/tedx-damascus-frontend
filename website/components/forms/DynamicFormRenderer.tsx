'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GenericApiForm } from '@/components/forms/GenericApiForm';
import { ROLE_MAP } from './form-role-map';

interface DynamicFormRendererProps {
  slug: string;
  locale: string;
}

// Static slug → targetRole mapping for known named routes
const SLUG_ROLE: Record<string, string> = {
  speaker:         'Speaker',
  speakers:        'Speaker',
  'speakers-2026': 'Speaker',
  attendee:        'Attendee',
  attendees:       'Attendee',
  volunteer:       'Volunteer',
  volunteers:      'Volunteer',
};

// Roles whose forms are not yet open — redirect to home
const UNAVAILABLE_ROLES = new Set(['Attendee', 'Volunteer']);

export function DynamicFormRenderer({ slug, locale }: DynamicFormRendererProps) {
  const router = useRouter();
  const role = SLUG_ROLE[slug.toLowerCase()];

  useEffect(() => {
    if (role && UNAVAILABLE_ROLES.has(role)) {
      router.replace(`/${locale}/home`);
    }
  }, [role, locale, router]);

  // Show nothing while redirecting for unavailable forms
  if (role && UNAVAILABLE_ROLES.has(role)) {
    return (
      <div className="bg-[#101010] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Form = role ? ROLE_MAP[role] : undefined;

  if (Form) return <Form locale={locale} />;

  // Unknown slug — fetch from API
  return <GenericApiForm formId={slug} locale={locale} />;
}
