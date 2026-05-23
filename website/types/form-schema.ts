export type ApiQuestionType =
  | 'section'
  | 'short_text'
  | 'long_text'
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone_number'
  | 'number'
  | 'single_choice'
  | 'checkbox_group'
  | 'date'
  | 'date_range'
  | 'url'
  | 'rating'
  | 'file_upload';

export interface ApiOption {
  id: string;
  orderIndex: number;
  label: { en: string; ar?: string };
}

export interface ApiQuestion {
  id: string;
  orderIndex: number;
  type: ApiQuestionType;
  parentId: string | null;
  title: { en: string; ar?: string };
  helpText?: { en: string; ar?: string };
  isRequired: boolean;
  config: {
    min?: number;
    max?: number;
    min_date?: string;
    max_date?: string;
    min_selected?: number;
    max_selected?: number;
    min_length?: number;
    max_length?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  options: ApiOption[];
}

export interface ApiFormData {
  id: string;
  name: { en: string; ar?: string };
  description?: { en: string; ar?: string };
  targetRole: string;
  status?: string;
  slug?: { en: string; ar?: string };
  questions: ApiQuestion[];
}

export interface ApiFormResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ApiFormData;
}

export interface FormSubmitResponse {
  success: boolean;
  message?: string;
  id?: string;
}
