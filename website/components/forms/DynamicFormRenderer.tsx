'use client';

import { SpeakerForm } from '@/components/forms/SpeakerForm';
import { AttendeeForm } from '@/components/forms/AttendeeForm';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { GenericApiForm } from '@/components/forms/GenericApiForm';

interface DynamicFormRendererProps {
  slug: string;
  locale: string;
}

const FORM_MAP: Record<string, React.ComponentType<{ locale: string }>> = {
  speaker:    SpeakerForm,
  speakers:   SpeakerForm,
  attendee:   AttendeeForm,
  attendees:  AttendeeForm,
  volunteer:  VolunteerForm,
  volunteers: VolunteerForm,
};

export function DynamicFormRenderer({ slug, locale }: DynamicFormRendererProps) {
  const Form = FORM_MAP[slug.toLowerCase()];

  if (!Form) {
    return <GenericApiForm formId={slug} locale={locale} />;
  }

  return <Form locale={locale} />;
}
