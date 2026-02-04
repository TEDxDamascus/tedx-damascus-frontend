export interface Speaker {
  id: string;
  slug: string;
  name: string;
  bio: LocalizedContent;
  talkTitle: LocalizedContent;
  talkDescription: LocalizedContent;
  image: string;
  videoUrl?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  isFeatured: boolean;
  events: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  slug: string;
  title: LocalizedContent;
  description: LocalizedContent;
  date: string;
  location: string;
  image: string;
  speakers: string[];
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedContent;
  content: LocalizedContent;
  excerpt: LocalizedContent;
  image: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  isFeatured: boolean;
  status: 'draft' | 'published';
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedContent {
  en: string;
  ar: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  label: LocalizedContent;
  placeholder?: LocalizedContent;
  required: boolean;
  options?: Array<{ value: string; label: LocalizedContent }>;
  validation?: any;
}

export interface DynamicForm {
  id: string;
  name: string;
  type: 'volunteer' | 'speaker';
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  createdAt: string;
}

export interface SEOMetadata {
  title: LocalizedContent;
  description: LocalizedContent;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}
