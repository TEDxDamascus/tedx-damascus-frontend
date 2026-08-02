import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

export function getLocalizedContent<T extends { en: string; ar: string }>(
  content: T,
  locale: string
): string {
  return locale === 'ar' ? content.ar : content.en;
}

export function getLocalizedSlug(
  slug: string | { en: string; ar: string },
  locale: string
): string {
  if (typeof slug === 'string') {
    return slug;
  }
  return locale === 'ar' ? slug.ar : slug.en;
}

/**
 * Resolves an API field that should be a plain string but may arrive as a
 * `{ en, ar }` localized object — or, when a backend response is inconsistent,
 * as a localized object nested one level deeper. Always returns a string, so
 * it's safe to render directly without risking "object as React child" crashes.
 */
export function pickLocaleText(value: unknown, locale: string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const preferred = obj[locale] ?? obj.en ?? obj.ar;
    if (typeof preferred === 'string') return preferred;
    if (preferred != null && typeof preferred === 'object') return pickLocaleText(preferred, locale);
  }
  return '';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function generateMetaTags(
  title: string,
  description: string,
  image?: string,
  url?: string
) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export function isRTL(locale: string): boolean {
  return locale === 'ar';
}

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
