'use client';

import { Facebook, Instagram, Linkedin } from 'lucide-react';

type ShareBarProps = {
  title: string;
  description?: string;
  url: string;
  locale?: string;
};

function buildShareLinks(title: string, description: string, url: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}${encodedDescription ? `%20${encodedDescription}` : ''}`,
    instagram: 'https://www.instagram.com/',
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  };
}

export function ShareBar({ title, description = '', url, locale = 'en' }: ShareBarProps) {
  const shareLinks = buildShareLinks(title, description, url);
  const caption = locale === 'ar' ? 'أحببت هذا المقال؟ شاركه مع صديق' : 'Like what you see? Share with a friend.';

  return (
    <div 
      className="w-full max-w-[1120px] min-h-[64px] mx-auto bg-[#1a1a1a] border border-white/5 rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden text-gray-200"
      style={{
        backgroundImage: "url('/images/blogs/Group 2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <span className="text-sm md:text-base font-medium relative z-10">{caption}</span>

      <div className="flex items-center space-x-4 relative z-10">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E11D48] hover:opacity-80 transition-all duration-200"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5 fill-current stroke-none" />
        </a>
        <a
          href={shareLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E11D48] hover:opacity-80 transition-all duration-200"
          aria-label="Share on Instagram"
        >
          <Instagram className="w-5 h-5 stroke-[2.5]" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E11D48] hover:opacity-80 transition-all duration-200"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5 fill-current stroke-none" />
        </a>
      </div>
    </div>
  );
}