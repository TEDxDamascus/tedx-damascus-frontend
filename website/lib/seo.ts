import { BlogJsonLd } from './api/blogs.types';

export function getJsonLdString(jsonLd: BlogJsonLd, locale: string): string {
  const data = locale === 'ar' ? jsonLd.ar : jsonLd.en;
  return JSON.stringify(data);
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
