import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/routing';
import { Footer } from '@/components/layout/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogSection } from '@/components/blog/BlogSection';
import { Metadata } from 'next';
import { blogsService } from '@/lib/api/blogs.service';
import { getBlogListJsonLdString } from '@/lib/seo';
import { Blog } from '@/lib/api/blogs.types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  try {
    const response = await blogsService.getBlogs({
      page: 1,
      limit: 1,
      lang: locale,
      sort: 'createdAt',
      order: 'desc',
    });

    const firstBlog = response.data[0];
    
    if (firstBlog?.seo) {
      const title = firstBlog.seo.meta_title;
      const description = firstBlog.seo.meta_description;
      const keywords = firstBlog.seo.meta_keywords;
      const ogTitle = firstBlog.seo.og_title;
      const ogDescription = firstBlog.seo.og_description;
      const ogImage = typeof firstBlog.seo.og_image === 'string' ? firstBlog.seo.og_image : firstBlog.seo.og_image?.url || null;
      const canonicalUrl = firstBlog.seo.canonical_url;

      return {
        title: locale === 'ar' ? 'المدونة | TEDx Damascus' : 'Blog | TEDx Damascus',
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
    title: locale === 'ar' ? 'المدونة | TEDx Damascus' : 'Blog | TEDx Damascus',
    description: locale === 'ar' 
      ? 'اكتشف أحدث المقالات والأخير من TEDx Damascus'
      : 'Discover the latest articles and news from TEDx Damascus',
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let blogs: Blog[] = [];
  try {
    const response = await blogsService.getBlogs({
      page: 1,
      limit: 10,
      lang: locale,
      sort: 'createdAt',
      order: 'desc',
    });
    blogs = response.data;
  } catch (error) {
    console.error('Failed to fetch blogs for JSON-LD:', error);
  }

  const jsonLd = getBlogListJsonLdString(blogs, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <main className="relative">
        <BlogHero locale={locale} />
        <BlogSection locale={locale} />
        <Footer locale={locale} />
      </main>
    </>
  );
}
