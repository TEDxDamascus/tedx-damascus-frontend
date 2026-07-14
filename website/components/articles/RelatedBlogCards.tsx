'use client';

import { BlogCard } from '@/components/blog/BlogCard';
import { RelatedArticleCardProps } from './types';

interface RelatedBlogCardsProps {
  articles: RelatedArticleCardProps[];
  locale?: string;
}

export function RelatedBlogCards({
  articles,
  locale,
}: RelatedBlogCardsProps) {
  const isRtl = locale === 'ar';

  if (!articles?.length) {
    return (
      <section className="relative py-[30px] bg-black font-helvetica">
        <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6">
          <h2 className="text-[34px] font-bold text-white leading-tight mb-6">
            Related Articles
          </h2>
          <p className="text-base text-gray-400">
            {isRtl ? 'لا توجد مقالات ذات صلة' : 'No related articles available.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-[30px] bg-black font-helvetica">
      <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div
          className={`flex flex-col gap-4 mb-10 lg:mb-14 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <h2 className="text-[34px] font-bold text-white leading-tight">
            Related Articles
          </h2>

        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="h-full transition-transform duration-300 hover:-translate-y-1 last:mb-16 md:last:mb-0"
            >
              <BlogCard
                {...article}
                isRtl={isRtl}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}