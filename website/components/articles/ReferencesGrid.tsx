'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { BlogReference } from '@/lib/api/blog-references.types';

interface ReferencesGridProps {
  references: BlogReference[];
}

export function ReferencesGrid({ references }: ReferencesGridProps) {
  if (!references?.length) {
    return (
      <section className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-8 text-white font-helvetica">
        <h2 className="text-[34px] font-semibold mb-6 tracking-tight">References</h2>
        <p className="text-base text-gray-400">No references available.</p>
      </section>
    );
  }

  // Map backend data to the design format
  const mappedReferences = references.map((ref) => ({
    id: ref._id,
    title: ref.name,
    imageUrl: '/favicon.ico', // Fallback image since backend doesn't provide images
    link: ref.url,
  }));

  return (
    <section className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-8 text-white font-helvetica">
      <h2 className="text-[34px] font-semibold mb-6 tracking-tight">References</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mappedReferences.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-[#121212] border border-white/5 rounded-2xl p-3 transition-all duration-300 hover:bg-[#1a1a1a] hover:border-white/10"
          >
            {/* Thumbnail Wrapper */}
          <div className="relative w-[140px] h-[84px] rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 isolation-auto">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* External Link Overlay Badge Container with Inverted Corners */}
              <div className="absolute bottom-0 right-0 w-8 h-8  flex items-end justify-end bg-[#121212] group-hover:bg-[#1a1a1a] rounded-tl-xl transition-colors duration-300">
                
                <div className="absolute -top-[20px] right-0 w-[20px] h-[20px] rounded-br-lg bg-transparent transition-all duration-300
                                shadow-[4px_4px_0_4px_#121212] group-hover:shadow-[4px_4px_0_4px_#1a1a1a]" />
                
                <div className="absolute bottom-0 -left-[20px] w-[20px] h-[20px] rounded-br-lg bg-transparent transition-all duration-300
                                shadow-[4px_4px_0_4px_#121212] group-hover:shadow-[4px_4px_0_4px_#1a1a1a]" />

              <div className="flex items-center justify-center mr-0.5 mb-0.5 rounded-full  text-[#10B981] bg-black/20 backdrop-blur-sm
                                group-hover:text-[#10B981] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                  <ExternalLink  />
                </div>
              </div>
            </div>

            {/* Typography Content */}
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-sm md:text-base font-medium text-gray-200 line-clamp-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
