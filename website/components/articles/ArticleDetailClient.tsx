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
import { toPathSafeSlug } from '@/lib/utils';
import { getImageUrl } from '@/lib/api/client';
import { articleDetailHref, resolveArticleSlug } from '@/lib/article-slug';
import { Blog } from '@/lib/api/blogs.types';
import { BlogReference } from '@/lib/api/blog-references.types';

async function resolveBlogBySlug(slug: string, locale: string): Promise<Blog | null> {
  try {
    const response = await blogsService.getBlogBySlug(slug, locale);
    if (response?.data) return response.data;
  } catch {
    /* try sanitized list match */
  }

  try {
    const listResponse = await blogsService.getBlogs({
      page: 1,
      limit: 100,
      lang: locale as 'en' | 'ar',
      sort: 'createdAt',
      order: 'desc',
    });
    const match = listResponse.data.find((blog) => toPathSafeSlug(blog.slug) === slug);
    if (!match) return null;
    const detail = await blogsService.getBlogById(match._id, locale);
    return detail?.data || null;
  } catch {
    return null;
  }
}

interface ArticleDetailClientProps {
  locale: string;
}

export function ArticleDetailClient({ locale }: ArticleDetailClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string }>();
  const slug = resolveArticleSlug(pathname, searchParams.get('slug'), params.slug);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [references, setReferences] = useState<BlogReference[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    isRtl: boolean;
    slug: string;
    read_time?: string | number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setBlog(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const found = await resolveBlogBySlug(slug, locale);
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
          const relatedBlogs = await blogsService.getRelatedBlogs(found.related_blogs_ids, locale);
          related = relatedBlogs.map((relatedBlog) => ({
            id: relatedBlog._id,
            title: relatedBlog.title,
            category: relatedBlog.category_id?.name || 'Blog',
            date: new Date(relatedBlog.publishedAt || relatedBlog.createdAt).toLocaleDateString(locale, {
              month: 'short',
              year: 'numeric',
            }),
            image: getImageUrl(relatedBlog.blog_image),
            isRtl: locale === 'ar',
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
          category: found.category_id?.name || 'Blog',
          date: new Date(found.publishedAt || found.createdAt).toLocaleDateString(locale, {
            month: 'short',
            year: 'numeric',
          }),
          image: getImageUrl(found.blog_image),
          isRtl: locale === 'ar',
          slug: found.slug,
          read_time: found.read_time,
        }];
      }

      if (!cancelled) {
        setRelatedArticles(related);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar locale={locale} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="animate-pulse font-helvetica text-white/50">Loading...</span>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Navbar locale={locale} />
        <p className="text-xl">{locale === 'ar' ? 'المقال غير موجود' : 'Article not found'}</p>
      </main>
    );
  }

  const shareUrl =
    blog.seo?.canonical_url ||
    blog.json_ld?.url ||
    `https://tedxdamascus.sy${articleDetailHref(locale, slug)}`;

  return (
    <main className="bg-black text-white">
      {blog.json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.json_ld) }}
        />
      )}
      <BlogHero locale={locale} />

      <div className="mx-auto max-w-[1120px] space-y-[30px] px-4 lg:px-6">
        <RelatedArticles
          articles={relatedArticles}
          locale={locale}
          shareUrl={shareUrl}
          shareTitle={blog.title}
          author={blog.author ? {
            name: blog.author.author_name?.[locale as 'ar' | 'en'] || blog.author.name,
            avatar: blog.author.author_image_url || blog.author.avatar,
            role: blog.author.author_description?.[locale as 'ar' | 'en'] || blog.author.description,
            bio: blog.author.bio,
            image: blog.author.image,
          } : (blog.user_name ? { name: blog.user_name } : null)}
        />
        <ArticleContent blog={blog} locale={locale} />
        <div className="my-[30px] h-px w-full bg-[#868686]" />
        <ShareBar
          title={blog.title}
          description={blog.description || blog.seo?.meta_description || ''}
          url={shareUrl}
          locale={locale}
        />
        <ReferencesGrid references={references} />
        <RelatedBlogCards articles={relatedArticles} locale={locale} />
      </div>

      <Footer locale={locale} />
    </main>
  );
}
