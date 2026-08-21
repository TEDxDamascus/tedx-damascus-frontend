import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { Footer } from '@/components/layout/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { RelatedBlogCards } from '@/components/articles/RelatedBlogCards';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { ShareBar } from '@/components/articles/ShareBar';
import { ReferencesGrid } from '@/components/articles/ReferencesGrid';
import type { ArticlePageProps } from '@/components/articles/types';
import { blogsService } from '@/lib/api/blogs.service';
import { blogReferencesService } from '@/lib/api/blog-references.service';
import { getLocalizedSlug, toPathSafeSlug } from '@/lib/utils';
import { Blog } from '@/lib/api/blogs.types';
import { Metadata } from 'next';
import { getImageUrl } from '@/lib/api/client';
import { BlogReference } from '@/lib/api/blog-references.types';

const MOCK_ARTICLE: ArticlePageProps['article'] = {
  category: 'Culture',
  title: 'How Thoughtful Editorial Design Elevates Every Story',
  author: 'Lina Haddad',
  date: 'June 24, 2026',
  readTime: '8 min read',
  image: '/images/blogs/article.png',
  excerpt: 'A modern reading page balances strong visuals, calm structure, and responsive typography so every paragraph feels intentional.',
};

const MOCK_AUTHOR = {
  name: 'Lina Haddad',
  role: 'Editorial Director',
  avatar: '/images/hero/tedx-hero.png',
  bio: 'Lina crafts storytelling experiences for progressive brands, blending editorial clarity with warm digital expression.',
  links: [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
};

const MOCK_TOC = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'Editorial structure', href: '#structure' },
  { label: 'Visual rhythm', href: '#rhythm' },
  { label: 'Author notes', href: '#author-notes' },
];

const MOCK_RELATED = Array.from({ length: 3 }).map((_, index) => ({
  id: String(index + 1),
  title: 'How to Write Articles with AI? Include Your Unique Perspective',
  category: 'Category',
  date: 'May 20, 2025',
  image: '/images/blogs/article.png',
  isRtl: false,
  slug: `related-article-${index + 1}`,
}));

export async function generateStaticParams() {
  try {
    // Fetch all published blogs for both locales to generate static params
    const [enResponse, arResponse] = await Promise.all([
      blogsService.getBlogs({
        page: 1,
        limit: 100,
        lang: 'en',
        sort: 'createdAt',
        order: 'desc',
      }),
      blogsService.getBlogs({
        page: 1,
        limit: 100,
        lang: 'ar',
        sort: 'createdAt',
        order: 'desc',
      }),
    ]);

    // Editor-entered slugs sometimes contain literal spaces (e.g. a title typed
    // straight into the slug field). `output: "export"` turns the raw slug into
    // a directory name, so an un-sanitized slug produces a path with spaces in
    // it — which breaks some hosting platforms' post-build packaging steps even
    // though `next build` itself completes fine. See resolveBlogBySlug below for
    // how the sanitized param is matched back to the real record when rendering.
    const enSlugs = enResponse.data.map((blog) => toPathSafeSlug(blog.slug));
    const arSlugs = arResponse.data.map((blog) => toPathSafeSlug(blog.slug));

    return [
      ...enSlugs.map((slug) => ({ locale: 'en', slug })),
      ...arSlugs.map((slug) => ({ locale: 'ar', slug })),
    ];
  } catch (error) {
    console.error('Failed to fetch blogs for static params:', error);
    // Return empty array as fallback - will cause build to fail if no params
    return [];
  }
}

// Resolves a blog by its (possibly path-sanitized) slug. Tries the direct
// by-slug endpoint first — the fast path for the vast majority of slugs, which
// have no whitespace and are unchanged by toPathSafeSlug. Falls back to
// matching the sanitized slug against the full list when that 404s, which
// happens for the handful of CMS entries whose real slug contains spaces.
async function resolveBlogBySlug(slug: string, locale: string): Promise<Blog | null> {
  try {
    const response = await blogsService.getBlogBySlug(slug, locale);
    if (response?.data) return response.data;
  } catch (error) {
    console.error('Direct blog-by-slug lookup failed, trying sanitized-slug fallback:', error);
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
  } catch (error) {
    console.error('Failed to resolve blog via sanitized-slug fallback:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const blog = await resolveBlogBySlug(slug, locale);

    if (blog?.seo) {
      const title = blog.seo.meta_title;
      const description = blog.seo.meta_description;
      const keywords = blog.seo.meta_keywords;
      const ogTitle = blog.seo.og_title;
      const ogDescription = blog.seo.og_description;
      const ogImage = typeof blog.seo.og_image === 'string' ? blog.seo.og_image : blog.seo.og_image?.url || null;
      const canonicalUrl = blog.seo.canonical_url;

      return {
        title,
        description,
        keywords: Array.isArray(keywords) ? keywords.join(', ') : '',
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          images: ogImage ? [{ url: ogImage }] : [],
          url: canonicalUrl,
          locale: locale === 'ar' ? 'ar_SA' : 'en_US',
        } as any,
        twitter: {
          card: 'summary_large_image',
          title: ogTitle,
          description: ogDescription,
          images: ogImage ? [ogImage] : [],
        },
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch blog metadata:', error);
  }

  return {
    title: locale === 'ar' ? 'المقال | TEDx Damascus' : 'Article | TEDx Damascus',
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let blog: Blog | null = null;
  let references: BlogReference[] = [];
  let referencesError = '';

  try {
    blog = await resolveBlogBySlug(slug, locale);
  } catch (error) {
    console.error('Failed to fetch blog:', error);
  }

  if (blog && blog._id) {
    try {
      const referencesResponse = await blogReferencesService.getBlogReferences(blog._id);
      references = referencesResponse.data || [];
    } catch (error) {
      console.error('Failed to fetch blog references:', error);
      referencesError = locale === 'ar' 
        ? 'فشل في تحميل المراجع' 
        : 'Failed to load references';
    }
  }

  if (!blog) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">{locale === 'ar' ? 'المقال غير موجود' : 'Article not found'}</p>
      </main>
    );
  }

  const imageUrl = getImageUrl(blog.blog_image);
  const shareUrl = blog.seo?.canonical_url || blog.json_ld?.url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tedxdamascus.com'}/${locale}/articles/${slug}`;
  
  // Fetch related blogs if IDs exist, otherwise use current blog as featured
  let relatedArticles: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    isRtl: boolean;
    slug: string;
    read_time?: string | number;
  }> = [];
  
  if (blog.related_blogs_ids && blog.related_blogs_ids.length > 0) {
    try {
      const relatedBlogs = await blogsService.getRelatedBlogs(blog.related_blogs_ids, locale);
      relatedArticles = relatedBlogs.map((relatedBlog) => ({
        id: relatedBlog._id,
        title: relatedBlog.title,
        category: relatedBlog.category_id?.name || 'Blog',
        date: new Date(relatedBlog.publishedAt || relatedBlog.createdAt).toLocaleDateString(locale, {
          month: 'short',
          year: 'numeric'
        }),
        image: getImageUrl(relatedBlog.blog_image),
        isRtl: locale === 'ar',
        slug: relatedBlog.slug,
        read_time: relatedBlog.read_time,
      }));
    } catch (error) {
      console.error('Failed to fetch related blogs:', error);
    }
  }
  
  // If no related blogs, use current blog as featured
  if (relatedArticles.length === 0) {
    relatedArticles = [{
      id: blog._id,
      title: blog.title,
      category: blog.category_id?.name || 'Blog',
      date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(locale, {
        month: 'short',
        year: 'numeric'
      }),
      image: imageUrl,
      isRtl: locale === 'ar',
      slug: blog.slug,
      read_time: blog.read_time,
    }];
  }

  return (
    <main className="bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.json_ld) }}
      />
      <BlogHero locale={locale} />

      <div className="max-w-[1120px] mx-auto px-4 lg:px-6 space-y-[30px]">
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
            image: blog.author.image
          } : (blog.user_name ? { name: blog.user_name } : null)}
        />  
        <ArticleContent blog={blog} locale={locale} />
        <div className="w-full h-px bg-[#868686] my-[30px]" />
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
