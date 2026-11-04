import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Static export: Next emits this as /robots.txt at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal shells / form endpoints add no SEO value.
        disallow: ['/_next/', '/*/forms/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
