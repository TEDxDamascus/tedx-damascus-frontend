'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { BlogHero } from '@/components/blog/BlogHero';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { RelatedBlogCards } from '@/components/articles/RelatedBlogCards';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { ShareBar } from '@/components/articles/ShareBar';
import { ReferencesGrid } from '@/components/articles/ReferencesGrid';
import { blogsService } from '@/lib/api/blogs.service';
import { blogReferencesService } from '@/lib/api/blog-references.service';
import { getLocalizedSlug, pickLocaleText, toPathSafeSlug } from '@/lib/utils';
import { extractMediaUrl, getImageUrl, teamApi } from '@/lib/api/client';
import { getAllOrganizers } from '@/lib/api/organizers';
import { resolveArticleSlug } from '@/lib/article-slug';
import { canonicalProfileShareUrl } from '@/lib/share-url';
import { Blog } from '@/lib/api/blogs.types';
import { BlogReference } from '@/lib/api/blog-references.types';

function personNameKeys(value: unknown): string[] {
  const names = new Set<string>();
  const add = (entry: unknown) => {
    if (typeof entry === 'string' && entry.trim()) {
      names.add(entry.trim().toLowerCase().replace(/\s+/g, ' '));
      return;
    }
    if (entry && typeof entry === 'object') {
      const obj = entry as Record<string, unknown>;
      add(obj.en);
      add(obj.ar);
      add(obj.name);
    }
  };
  add(value);
  return [...names];
}

function pickBlogAuthorImage(blog: Blog): string {
  const author = blog.author ?? {};
  const candidates = [
    author.image,
    author.author_image,
    author.author_image_url,
    author.avatar,
    blog.author_image,
    blog.json_ld?.author?.image,
  ];
  for (const candidate of candidates) {
    const url = extractMediaUrl(candidate);
    if (url) return url;
  }
  return '';
}

async function lookupDirectoryPhoto(names: string[]): Promise<string> {
  if (names.length === 0) return '';
  const matches = (name: unknown) => personNameKeys(name).some((key) => names.includes(key));

  try {
    const organizers = await getAllOrganizers();
    const hit = organizers.find((organizer) => matches(organizer.name));
    const url = extractMediaUrl(hit?.image);
    if (url) return url;
  } catch {
    /* try team next */
  }

  try {
    const response = await teamApi.getAll({ limit: 500 });
    const members = Array.isArray(response) ? response : (response.data ?? []);
    const hit = members.find((member) => matches(member.name));
    const url = extractMediaUrl(hit?.image);
    if (url) return url;
  } catch {
    /* keep the default avatar */
  }

  return '';
}

async function fetchBlogBySlug(slug: string, locale: string): Promise<Blog | null> {
  try {
    const response = await blogsService.getBlogBySlug(slug, locale);
    if (response?.data) return response.data;
  } catch {
    /* try list / other locale */
  }
  return null;
}

async function fetchBlogById(id: string, locale: string): Promise<Blog | null> {
  try {
    const detail = await blogsService.getBlogById(id, locale);
    return detail?.data || null;
  } catch {
    return null;
  }
}

async function matchBlogFromList(slug: string, locale: string): Promise<Blog | null> {
  try {
    const listResponse = await blogsService.getBlogs({
      page: 1,
      limit: 100,
      lang: locale as 'en' | 'ar',
      sort: 'createdAt',
      order: 'desc',
    });
    const match = listResponse.data.find((blog) => {
      const localized = getLocalizedSlug(blog.slug, locale);
      const raw = typeof blog.slug === 'string' ? toPathSafeSlug(blog.slug) : localized;
      return localized === slug || raw === slug;
    });
    if (!match) return null;
    return (await fetchBlogById(match._id, locale)) || match;
  } catch {
    return null;
  }
}

async function resolveBlogBySlug(slug: string, locale: string): Promise<Blog | null> {
  const found = await fetchBlogBySlug(slug, locale);
  if (found) return found;

  const fromList = await matchBlogFromList(slug, locale);
  if (fromList) return fromList;

  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const other = (await fetchBlogBySlug(slug, otherLocale)) || (await matchBlogFromList(slug, otherLocale));
  if (!other?._id) return null;
  return (await fetchBlogById(other._id, locale)) || other;
}

interface ArticleDetailClientProps {
  locale: string;
}

export function ArticleDetailClient({ locale }: ArticleDetailClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string; locale?: string }>();
  const activeLocale = params.locale === 'ar' || params.locale === 'en' ? params.locale : locale;
  const slug = resolveArticleSlug(pathname, searchParams.get('slug'), params.slug);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [references, setReferences] = useState<BlogReference[]>([]);
  const [authorProfile, setAuthorProfile] = useState<{
    name?: string;
    bio?: string;
    avatar?: string;
    image?: string;
    role?: string;
    description?: string;
  } | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    category: string;
    date: string;
    image: string;
    isRtl: boolean;
    slug: string;
    read_time?: string | number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolvedSlug =
      slug ||
      (typeof window === 'undefined'
        ? ''
        : resolveArticleSlug(window.location.pathname, new URLSearchParams(window.location.search).get('slug'), params.slug));

    if (!resolvedSlug) {
      setBlog(null);
      setAuthorProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const found = await resolveBlogBySlug(resolvedSlug, activeLocale);
      if (cancelled) return;
      setBlog(found);

      if (!found?._id) {
        setLoading(false);
        return;
      }

      try {
        const referencesResponse = await blogReferencesService.getBlogReferences(found._id);
        if (!cancelled) setReferences(referencesResponse.data || []);
      } catch {
        if (!cancelled) setReferences([]);
      }

      let related: typeof relatedArticles = [];
      if (found.related_blogs_ids && found.related_blogs_ids.length > 0) {
        try {
          const relatedBlogs = await blogsService.getRelatedBlogs(found.related_blogs_ids, activeLocale);
          related = relatedBlogs.map((relatedBlog) => ({
            id: relatedBlog._id,
            title: relatedBlog.title,
            description: relatedBlog.description || '',
            category: relatedBlog.category_id?.name || 'Blog',
            date: new Date(relatedBlog.publishedAt || relatedBlog.createdAt).toLocaleDateString(activeLocale, {
              month: 'short',
              year: 'numeric',
            }),
            image: getImageUrl(relatedBlog.blog_image),
            isRtl: activeLocale === 'ar',
            slug: relatedBlog.slug,
            read_time: relatedBlog.read_time,
          }));
        } catch {
          related = [];
        }
      }

      if (related.length === 0) {
        related = [{
          id: found._id,
          title: found.title,
          description: found.description || '',
          category: found.category_id?.name || 'Blog',
          date: new Date(found.publishedAt || found.createdAt).toLocaleDateString(activeLocale, {
            month: 'short',
            year: 'numeric',
          }),
          image: getImageUrl(found.blog_image),
          isRtl: activeLocale === 'ar',
          slug: found.slug,
          read_time: found.read_time,
        }];
      }

      let authorImage = pickBlogAuthorImage(found);
      if (!authorImage) {
        const names = [
          ...personNameKeys(found.author?.name),
          ...personNameKeys(found.author?.author_name),
          ...personNameKeys(found.author_name),
        ];
        authorImage = await lookupDirectoryPhoto(names);
      }

      if (!cancelled) {
        setRelatedArticles(related);
        setAuthorProfile(
          found.author || found.author_name || found.user_name
            ? {
                name:
                  pickLocaleText(found.author_name, activeLocale) ||
                  found.author?.name ||
                  found.user_name ||
                  '',
                avatar: authorImage ? getImageUrl(authorImage) : '',
                role:
                  pickLocaleText(found.author_description, activeLocale) ||
                  found.author?.description ||
                  '',
                bio: found.author?.bio,
                image: authorImage || found.author?.image,
              }
            : null
        );
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeLocale, params.slug, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar locale={activeLocale} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="animate-pulse font-helvetica text-white/50">Loading...</span>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Navbar locale={activeLocale} />
        <p className="text-xl">{activeLocale === 'ar' ? 'المقال غير موجود' : 'Article not found'}</p>
      </main>
    );
  }

  const shareUrl =
    typeof window !== 'undefined'
      ? canonicalProfileShareUrl(window.location.href)
      : `https://tedxdamascus.sy/${activeLocale}/articles/${encodeURIComponent(slug)}/`;

  return (
    <main className="bg-black text-white">
      {blog.json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.json_ld) }}
        />
      )}
      <BlogHero locale={activeLocale} />

      <div className="mx-auto min-w-0 max-w-[1120px] space-y-[30px] px-4 lg:px-6">
        <RelatedArticles
          articles={relatedArticles}
          locale={activeLocale}
          shareUrl={shareUrl}
          shareTitle={blog.title}
          author={authorProfile}
        />
        <ArticleContent blog={blog} locale={activeLocale} />
        <div className="my-[30px] h-px w-full bg-[#868686]" />
        <ShareBar
          title={blog.title}
          description={blog.description || blog.seo?.meta_description || ''}
          url={shareUrl}
          locale={activeLocale}
        />
        <ReferencesGrid references={references} />
        <RelatedBlogCards articles={relatedArticles} locale={activeLocale} />
      </div>

      <Footer locale={activeLocale} />
    </main>
  );
}
