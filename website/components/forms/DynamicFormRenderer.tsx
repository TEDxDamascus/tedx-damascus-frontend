'use client';

import { SpeakerForm } from '@/components/forms/SpeakerForm';
import { AttendeeForm } from '@/components/forms/AttendeeForm';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

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
    return (
      <div className="relative bg-[#101010] min-h-screen">
        <Navbar locale={locale} />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[#bebebe] font-helvetica">Form not found.</p>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  return <Form locale={locale} />;
}
