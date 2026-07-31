'use client';

import { BlogCard } from './BlogCard';
import { Blog } from '@/lib/api/blogs.types';
import { getLocalizedContent, formatDate, getLocalizedSlug } from '@/lib/utils';
import { getImageUrl } from '@/lib/api/client';

interface BlogGridProps {
  blogs: Blog[];
  isRtl: boolean;
  locale: string;
}

export function BlogGrid({ blogs, isRtl, locale }: BlogGridProps) {
  return (
    <>
      {blogs.map((blog) => {
        const title = blog.title;
        const excerpt = blog.description || '';
        const tags = blog.tags || [];
        const imageUrl = getImageUrl(blog.blog_image);
        const category = blog.category_id?.name || (Array.isArray(tags) && tags.length > 0 ? tags[0] : 'Blog');
        const slug = getLocalizedSlug(blog.slug, locale);

        return (
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={title}
            description={excerpt}
            category={category}
            date={formatDate(blog.createdAt, locale)}
            image={imageUrl}
            isRtl={isRtl}
            slug={slug}
            locale={locale}
            read_time={blog.read_time}
          />
        );
      })}
    </>
  );
}
