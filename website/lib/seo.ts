import type { Metadata } from 'next';
import { BlogJsonLd } from './api/blogs.types';

/** Canonical production origin for the site (no trailing slash). */
export const SITE_URL = 'https://tedxdamascus.sy';

/**
 * Build hreflang language alternates + canonical for a given locale-agnostic path.
 * The path must start with '/' and NOT include the locale prefix (e.g. '/events', '/blog').
 * Pass '/' or '' for the locale home page.
 */
export function buildLanguageAlternates(
  path: string,
  currentLocale: string,
): NonNullable<Metadata['alternates']> {
  const clean = !path || path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
  return {
    canonical: `${SITE_URL}/${currentLocale}${clean}`,
    languages: {
      en: `${SITE_URL}/en${clean}`,
      ar: `${SITE_URL}/ar${clean}`,
      'x-default': `${SITE_URL}/en${clean}`,
    },
  };
}

export function getJsonLdString(jsonLd: BlogJsonLd): string {
  return JSON.stringify(jsonLd);
}

/** Event (schema.org/Event) structured data for an event detail page. */
export function getEventJsonLdString(input: {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  locationName?: string;
  locationAddress?: string;
  image?: string;
  url?: string;
  status?: string;
}): string {
  const isPast = (input.status ?? '').toLowerCase() === 'past';
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: isPast
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: 'TEDxDamascus',
      url: SITE_URL,
    },
  };

  if (input.description) jsonLd.description = input.description;
  if (input.startDate) jsonLd.startDate = input.startDate;
  if (input.endDate) jsonLd.endDate = input.endDate;
  if (input.image) jsonLd.image = [input.image];
  if (input.url) jsonLd.url = input.url;
  if (input.locationName || input.locationAddress) {
    jsonLd.location = {
      '@type': 'Place',
      name: input.locationName || undefined,
      address: input.locationAddress || undefined,
    };
  }

  return JSON.stringify(jsonLd);
}

/** Article (schema.org/Article) structured data for a blog article page. */
export function getArticleJsonLdString(input: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
  authorName?: string;
}): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    publisher: {
      '@type': 'Organization',
      name: 'TEDxDamascus',
      url: SITE_URL,
    },
    author: {
      '@type': input.authorName ? 'Person' : 'Organization',
      name: input.authorName || 'TEDxDamascus',
    },
  };

  if (input.description) jsonLd.description = input.description;
  if (input.image) jsonLd.image = [input.image];
  if (input.datePublished) jsonLd.datePublished = input.datePublished;
  if (input.dateModified) jsonLd.dateModified = input.dateModified;
  if (input.url) {
    jsonLd.url = input.url;
    jsonLd.mainEntityOfPage = { '@type': 'WebPage', '@id': input.url };
  }

  return JSON.stringify(jsonLd);
}

/** BreadcrumbList (schema.org/BreadcrumbList) for navigational rich results. */
export function getBreadcrumbJsonLdString(
  items: { name: string; url: string }[],
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function getBlogListJsonLdString(blogs: any[], locale: string): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: locale === 'ar' ? 'مدونة TEDx Damascus' : 'TEDx Damascus Blog',
    description: locale === 'ar' 
      ? 'اكتشف أحدث المقالات والأخير من TEDx Damascus'
      : 'Discover the latest articles and news from TEDx Damascus',
    blogPost: blogs.map((blog) => ({
      '@type': 'BlogPosting',
      headline: locale === 'ar' ? blog.title.ar : blog.title.en,
      description: blog.excerpt ? (locale === 'ar' ? blog.excerpt.ar : blog.excerpt.en) : '',
      image: blog.featured_image,
      datePublished: blog.createdAt,
      dateModified: blog.updatedAt,
      url: blog.canonical_url,
    })),
  };

  return JSON.stringify(jsonLd);
}
