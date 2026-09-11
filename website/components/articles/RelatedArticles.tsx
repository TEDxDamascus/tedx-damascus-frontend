'use client';

import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { RelatedArticleCardProps } from './types';
import { getImageUrl } from '@/lib/api/client';

interface RelatedArticlesProps {
  articles: RelatedArticleCardProps[];
  locale?: string;
  shareUrl?: string;
  shareTitle?: string;
  author?: {
    name?: string;
    bio?: string;
    avatar?: string;
    image?: string;
    role?: string;
    description?: string;
  } | null;
}

function buildShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
    // Instagram has no web share URL for posts — open org profile as fallback
    instagram: 'https://www.instagram.com/TEDxDamascus',
  };
}

export function RelatedArticles({
  articles,
  locale,
  author,
  shareUrl = '',
  shareTitle,
}: RelatedArticlesProps) {
  const featuredArticle = articles[0];
  const imageUrl = featuredArticle?.image ? getImageUrl(featuredArticle.image) : '/images/blogs/article img.png';
  const isRtl = locale === 'ar';

  const title = shareTitle || featuredArticle?.title || 'TEDx Damascus';
  const shareLinks = buildShareLinks(shareUrl, title);
  const shareCaption = isRtl ? 'شارك مع مجتمعك!' : 'Share with your community!';

  const titleClass = [
    'w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere]',
    'text-[18px] font-bold leading-snug tracking-tight text-white',
    'sm:text-[20px] md:text-[24px] md:leading-[1.15]',
    isRtl ? 'font-arabic' : '',
  ].join(' ');

  const descriptionClass = [
    'w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere]',
    'text-[13px] leading-relaxed text-white/80 sm:text-sm',
    isRtl ? 'font-arabic' : '',
  ].join(' ');

  return (
    <div className="w-full bg-black text-white font-helvetica">
      <div className="mx-auto grid w-full min-w-0 max-w-[1120px] grid-cols-1 gap-[30px] lg:grid-cols-3">
        
    {/* Left Section: Featured Article */}
        {featuredArticle && (
          <div className="relative min-w-0 lg:col-span-2">
            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className="group relative mx-auto w-full min-w-0 max-w-[690px] overflow-hidden rounded-[16px] lg:mx-0 lg:h-[462px]"
            >
              {/* Background Image — keep landscape crop on desktop; full uncropped frame on small screens */}
              <div className="relative aspect-[690/462] w-full lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src={imageUrl}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

    {/* Bottom glass area: stacked under the image on small screens, compact overlay on desktop so the cover description stays visible */}
    <div className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[24px] lg:bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="relative flex min-w-0 flex-col justify-end gap-3 px-4 py-4 sm:gap-[14px] sm:px-6 sm:py-6 lg:px-6 lg:py-6">
        <span className="inline-flex w-fit max-w-full items-center truncate rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
          {featuredArticle.category}
        </span>

        <h1 className={titleClass}>
          {featuredArticle.title}
        </h1>

        {featuredArticle.description ? (
          <p className={`${descriptionClass} line-clamp-3 lg:hidden`}>
            {featuredArticle.description}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75 sm:text-sm">
          <span>{featuredArticle.date}</span>
          <span>•</span>
          <span>{featuredArticle.read_time} min read</span>
        </div>
      </div>
    </div>
  </div>
</div>
        )}

   {/* Right Section */}
<div className="flex h-auto w-full min-w-0 flex-col gap-[16px] lg:h-[462px]">

  {/* Author Card */}
    <div className="flex min-w-0 flex-1 flex-col overflow-visible rounded-[16px] border border-white/5 bg-[#272727] p-5 sm:p-6">
      <div  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white mb-5 shrink-0">
        <Image
          src={author?.avatar || (author?.image ? getImageUrl(author.image) : '/images/events/event-card.png')}
          alt={author?.name || "Author"}
          fill
          className="object-cover"
        />
      </div>

      <h2 className="w-full min-w-0 break-words text-xl font-bold text-white sm:text-2xl">
        {author?.name || "Author"}
      </h2>

      <p className="mt-2 w-full min-w-0 whitespace-normal break-words border-b border-white/10 pb-4 text-sm font-medium leading-relaxed text-gray-300">
        {author?.role || author?.description || ""}
      </p>

      {(author?.bio) ? (
        <p className="mt-4 w-full min-w-0 whitespace-normal break-words text-sm leading-6 text-[#B3B3B3]">
          {author.bio}
        </p>
      ) : null}
    </div>

  {/* Share Card */}
  <div style={{
        backgroundImage: "url('/images/blogs/Vector (1).svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}  className="flex-1 bg-[#E10613] rounded-[16px] p-6 relative overflow-hidden flex flex-col justify-between max-h-[99px]">


    <div className="relative z-10">
      <h3 className={['text-[16px] font-bold text-[#101010]', isRtl ? 'font-arabic' : ''].join(' ')}>
        {shareCaption}
      </h3>
    </div>

    <div className="relative h-[24px] max-w-[88px] z-10 flex gap-5">
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="transition-opacity hover:opacity-70"
      >
        <Facebook className="w-6 h-6 fill-current stroke-none text-[#101010]" />
      </a>

      <a
        href={shareLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TEDx Damascus on Instagram"
        className="transition-opacity hover:opacity-70"
      >
        <Instagram className="w-6 h-6 text-[#101010] stroke-[2.5]" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="transition-opacity hover:opacity-70"
      >
        <Linkedin className="w-6 h-6 fill-current stroke-none text-[#101010]" />
      </a>
    </div>
  </div>

</div>
        </div>
      </div>
  );
}
