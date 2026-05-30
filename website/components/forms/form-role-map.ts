import type { ComponentType } from 'react';
import { SpeakerForm } from './SpeakerForm';
import { AttendeeForm } from './AttendeeForm';
import { VolunteerForm } from './VolunteerForm';

export const ROLE_MAP: Record<string, ComponentType<{ locale: string }>> = {
  Speaker:   SpeakerForm,
  Attendee:  AttendeeForm,
  Volunteer: VolunteerForm,
};
