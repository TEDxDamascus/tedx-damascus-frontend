'use client';

import Link from 'next/link';
import type { BlogCardProps } from './types';
import { articleDetailHref } from '@/lib/article-slug';

export function BlogCard({
  title,
  category,
  date,
  image,
  isRtl,
  slug,
  // optional locale passed from grid
  locale,
  read_time,
}: BlogCardProps) {
  const content = (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="
        h-[372px]
        max-w-[358.67px]
        rounded-[20px]
        bg-card-bg
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        font-helvetica
      "
    >
      {/* Shared container for image + content alignment */}
      <div className="px-[12px] pt-[13px]">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="
            h-[210px]
            w-full
            max-w-[334.67px]
            rounded-[13px]
            object-cover
          "
        />

        {/* Content */}
        <div className="mt-3 w-full max-w-[334.67px] min-w-0">
          <div className="flex flex-col gap-[10px]">
            {/* Category */}

<div
  className="
    inline-flex
    h-[33px]
    w-fit
    px-4
    items-center
    justify-center
    rounded-full
    bg-[#303030]
    text-sm
    py-2
    font-medium
    text-[#f1f1f1]
    whitespace-nowrap
  "
>
    {category}
</div>
            

            {/* Title */}
            <h3
              className="
                line-clamp-2
                text-base
                font-semibold
                leading-6
                text-white
              "
            >
              {title}
            </h3>

            {/* Date */}
           <div className="flex items-center gap-2 text-sm text-white/75">
          <span>{date}</span>
          <span>•</span>
          <span>{read_time} min read</span>
        </div>
            

           
          </div>
        </div>
      </div>
    </div>
  );

  if (slug && typeof slug === 'string') {
    // Use provided locale or default to 'en'
    const lang = locale ?? 'en';
    return (
      <Link href={articleDetailHref(lang, slug)} className="block">
        {content}
      </Link>
    );
  }

  return content;
}