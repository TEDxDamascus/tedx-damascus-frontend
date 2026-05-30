'use client';

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

export function DynamicFormRenderer({ slug, locale }: DynamicFormRendererProps) {
  const role = SLUG_ROLE[slug.toLowerCase()];
  const Form = role ? ROLE_MAP[role] : undefined;

  if (Form) return <Form locale={locale} />;

  // Unknown slug — fetch from API; GenericApiForm will resolve targetRole
  return <GenericApiForm formId={slug} locale={locale} />;
}
