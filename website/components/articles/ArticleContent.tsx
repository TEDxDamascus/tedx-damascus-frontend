'use client';

import Image from 'next/image';
import { Blog } from '@/lib/api/blogs.types';
import { getImageUrl } from '@/lib/api/client';
import { Calendar, Clock, Tag, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getLocalizedSlug } from '@/lib/utils';

interface ArticleContentProps {
  blog: Blog;
  locale: string;
}

// YouTube link to iframe converter
function convertYouTubeLinks(html: string): string {
  // First, convert plain YouTube URLs to iframes
  const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S*)?/g;
  html = html.replace(youtubeRegex, (match, videoId) => {
    return `<iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/${videoId}" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen
      class="w-full aspect-video rounded-xl my-4"
    ></iframe>`;
  });
  
  // Then, replace YouTube links inside anchor tags with just the iframe
  // This handles cases where the backend already wrapped YouTube URLs in <a> tags
  const youtubeLinkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S*)?)\1[^>]*>(.*?)<\/a>/g;
  html = html.replace(youtubeLinkRegex, (match, quote, url, videoId, linkText) => {
    // If the link text is a YouTube URL, convert it to iframe
    if (linkText.includes('youtube.com') || linkText.includes('youtu.be')) {
      return `<iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen
        class="w-full aspect-video rounded-xl my-4"
      ></iframe>`;
    }
    return match; // Keep the original link if it's not a YouTube URL
  });
  
  return html;
}

// Make external links open in new tab
function processLinks(html: string): string {
  return html.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(https?:\/\/[^"']+)\1/g, (match, quote, url) => {
    return match.replace('href=', `target="_blank" rel="noopener noreferrer" href=`);
  });
}

export function ArticleContent({ blog, locale }: ArticleContentProps) {
  const imageUrl = getImageUrl(blog.blog_image);
  const isRtl = locale === 'ar';
  
  // Process HTML content
  let processedContent = blog.content || '';
  processedContent = convertYouTubeLinks(processedContent);
  processedContent = processLinks(processedContent);

  return (
    <section className="mx-auto min-w-0 max-w-[1120px] overflow-x-hidden px-0 py-[30px] font-helvetica sm:px-4">
      {/* Blog Header */}
 

      {/* Blog Content with Typography */}
      <div
        className={[
          'prose prose-sm sm:prose-lg prose-invert max-w-none min-w-0 break-words dark:prose-invert',
          '[&_h1]:break-words [&_h1]:text-xl [&_h1]:leading-snug sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl',
          '[&_h2]:break-words [&_h2]:text-lg [&_h2]:leading-snug sm:[&_h2]:text-2xl',
          '[&_h3]:break-words [&_h3]:text-base sm:[&_h3]:text-xl',
          '[&_p]:break-words [&_p]:[overflow-wrap:anywhere] [&_p]:max-w-full',
          '[&_li]:break-words [&_li]:[overflow-wrap:anywhere]',
          '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl',
          '[&_iframe]:max-w-full [&_iframe]:h-auto [&_iframe]:rounded-xl',
          isRtl ? 'font-arabic text-end' : '',
        ].join(' ')}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: processedContent }}
          className="min-w-0 max-w-full text-[#B3B3B3] [overflow-wrap:anywhere]"
        />
      </div>

      {/* Description */}
   
      {/* Gallery */}
      {blog.gallery && blog.gallery.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-white">
            {isRtl ? 'معرض الصور' : 'Gallery'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blog.gallery.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

     
    </section>
  );
}
