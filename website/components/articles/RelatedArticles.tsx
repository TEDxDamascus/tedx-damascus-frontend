'use client';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { RelatedArticleCardProps } from './types';
import { getImageUrl } from '@/lib/api/client';

interface RelatedArticlesProps {
  articles: RelatedArticleCardProps[];
  locale?: string;
  author?: {
    name?: string;
    bio?: string;
    avatar?: string;
    image?: string;
    role?: string;
    description?: string;
  } | null;
}

export function RelatedArticles({ articles, locale, author }: RelatedArticlesProps) {
  const featuredArticle = articles[0];
  const imageUrl = featuredArticle?.image ? getImageUrl(featuredArticle.image) : '/images/blogs/article img.png';
  const isRtl = locale === 'ar';

  return (
    <div className="w-full bg-black text-white font-helvetica">
      <div className={`mx-auto w-full max-w-[1120px] grid grid-cols-1 lg:grid-cols-3  gap-[30px]`}>
        
    {/* Left Section: Featured Article */}
        {featuredArticle && (
          <div className={`relative lg:col-span-2 `}>
            <div className={`relative w-full   max-w-[690px]  h-[462px] rounded-[16px] overflow-hidden group mx-auto lg:mx-0`}>
              {/* Background Image */}
              <Image
                src={imageUrl}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
    {/* Overall Overlay */}
    <div className="absolute inset-0 bg-black/10" />

    {/* Bottom Glass Content Area */}
    <div className="absolute bottom-0 left-0 right-0 md-h-[254px] lg-h-[190px]">
      {/* Blur */}
      <div className="absolute inset-0 backdrop-blur-[24px] bg-black/20" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-[24px] py-[24px] md:px-[24px] md:py-[24px] gap-[14px]">
        <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white">
          {featuredArticle.category}
        </span>

        <h1 className="max-w-[650px] text-[24px] md:text-[24px] font-bold leading-[1.15] tracking-tight text-white">
          {featuredArticle.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-white/75">
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
<div className="w-full lg:w-[400px] h-[462px] flex flex-col gap-[16px]">

  {/* Author Card */}
    <div className="  flex-1 bg-[#272727] border border-white/5 rounded-[16px] p-6 flex flex-col h-[333px]">
      <div  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white mb-5 ">
        <Image
          src={author?.avatar || getImageUrl(author?.image)}
          alt={author?.name || "Author"}
          fill
          className="object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold text-white">
        {author?.name || "Author"}
      </h2>

      <p className="text-sm font-medium text-gray-300 border-b border-white/10 pb-4 mt-2">
        {author?.role || author?.description || ""}
      </p>

      <p className="text-sm text-[#B3B3B3] leading-6 mt-4 line-clamp-5">  
        {author?.bio || ""}
      </p>
    </div>

  {/* Share Card */}
  <div style={{
        backgroundImage: "url('/images/blogs/Vector (1).svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}  className="flex-1 bg-[#E10613] rounded-[16px] p-6 relative overflow-hidden flex flex-col justify-between max-h-[99px]">


    <div className="relative z-10">
      <h3 className="text-[16px] font-bold text-[#101010]">
        Share with your community!
      </h3>
    </div>

    <div className="relative h-[24px] max-w-[88px] z-10 flex gap-5">
      <a href="#" aria-label="Facebook">
        <Facebook className="w-6 h-6 fill-current stroke-none text-[#101010]" />
      </a>

      <a href="#" aria-label="Instagram">
        <Instagram className="w-6 h-6 text-[#101010] stroke-[2.5]" />
      </a>

      <a href="#" aria-label="LinkedIn">
        <Linkedin className="w-6 h-6 fill-current stroke-none text-[#101010]" />
      </a>
    </div>
  </div>

</div>
        </div>
      </div>
  );
}
