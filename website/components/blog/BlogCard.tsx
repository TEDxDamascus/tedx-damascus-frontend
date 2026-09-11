'use client';

import Link from 'next/link';
import type { BlogCardProps } from './types';
import { articleDetailHref } from '@/lib/article-slug';

export function BlogCard({
  title,
  description,
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
        h-auto
        min-h-[372px]
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-[20px]
        bg-card-bg
        font-helvetica
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Shared container for image + content alignment */}
      <div className="min-w-0 px-[12px] pb-4 pt-[13px]">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="
            h-[210px]
            w-full
            max-w-full
            rounded-[13px]
            object-cover
          "
        />

        {/* Content */}
        <div className="mt-3 w-full min-w-0 max-w-full">
          <div className="flex min-w-0 flex-col gap-[10px]">
            {/* Category */}

<div
  className="
    inline-flex
    h-[33px]
    w-fit
    max-w-full
    items-center
    justify-center
    truncate
    rounded-full
    bg-[#303030]
    px-4
    py-2
    text-sm
    font-medium
    text-[#f1f1f1]
  "
>
    {category}
</div>
            

            {/* Title */}
            <h3
              className={[
                'line-clamp-2 break-words [overflow-wrap:anywhere] text-sm font-semibold leading-5 text-white sm:text-base sm:leading-6',
                isRtl ? 'font-arabic' : '',
              ].join(' ')}
            >
              {title}
            </h3>

            {description ? (
              <p
                className={[
                  'line-clamp-2 break-words [overflow-wrap:anywhere] text-xs leading-5 text-white/70 sm:text-sm',
                  isRtl ? 'font-arabic' : '',
                ].join(' ')}
              >
                {description}
              </p>
            ) : null}

            {/* Date */}
           <div className="flex flex-wrap items-center gap-2 text-sm text-white/75">
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
      <Link href={articleDetailHref(lang, slug)} className="block min-w-0 w-full">
        {content}
      </Link>
    );
  }

  return content;
}