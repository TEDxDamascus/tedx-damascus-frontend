import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { routing } from '@/routing';
import { getLocalizedSlug, toPathSafeSlug } from '@/lib/utils';
import { blogsService } from '@/lib/api/blogs.service';
import { eventsApi } from '@/lib/api/client';
import type { Blog } from '@/lib/api/blogs.types';

// Static export: Next emits this as /sitemap.xml at build time. Dynamic entries
// (blog articles, events) are fetched at build; if the API is unreachable the
// sitemap still ships with every static route (wrapped in try/catch below).
export const dynamic = 'force-static';

const STATIC_PATHS = [
  '/home',
  '/events',
  '/speakers',
  '/team',
  '/partners',
  '/about',
  '/blog',
  '/organizers',
] as const;

type LooseEvent = { slug?: string; _id?: string; id?: string; updatedAt?: string };

function langAlternates(path: string) {
  return {
    languages: {
      en: `${SITE_URL}/en${path}`,
      ar: `${SITE_URL}/ar${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── Static routes (one entry per locale, with hreflang alternates) ──
  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: path === '/home' ? 1 : 0.8,
        alternates: langAlternates(path),
      });
    }
  }

  // ── Blog articles ──
  try {
    const res = await blogsService.getBlogs({
      page: 1,
      limit: 500,
      lang: 'en',
      sort: 'createdAt',
      order: 'desc',
      status: 'published',
    });

    for (const blog of (res.data ?? []) as Blog[]) {
      const lastModified = blog.updatedAt ? new Date(blog.updatedAt) : now;
      for (const locale of routing.locales) {
        const slug = getLocalizedSlug(blog.slug, locale) || toPathSafeSlug(String(blog.slug ?? ''));
        if (!slug) continue;
        entries.push({
          url: `${SITE_URL}/${locale}/articles/${slug}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    /* API unavailable at build — ship static routes only */
  }

  // ── Events ──
  try {
    const eventsRes = await eventsApi.getAll({ limit: 500 });
    const list: LooseEvent[] = Array.isArray(eventsRes)
      ? (eventsRes as LooseEvent[])
      : ((eventsRes as { data?: LooseEvent[] })?.data ?? []);

    for (const ev of list) {
      const slug = ev.slug || ev._id || ev.id;
      if (!slug) continue;
      const lastModified = ev.updatedAt ? new Date(ev.updatedAt) : now;
      for (const locale of routing.locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/events/${slug}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    /* API unavailable at build — skip event entries */
  }

  return entries;
}
