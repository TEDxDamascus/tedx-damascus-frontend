'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout';
import { speakersApi, getImageUrl } from '@/lib/api/client';
import { SpeakerDetailHeader } from './SpeakerDetailHeader';
import { SpeakerDetailAbout } from './SpeakerDetailAbout';
import { SpeakerDetailGallery } from './SpeakerDetailGallery';
import { SpeakerDetailVideos } from './SpeakerDetailVideos';

interface ApiSpeakerDetail {
  _id?: string;
  name?: string;
  bio?: string;
  brief?: string;
  experience?: string;
  description?: string;
  speaker_image?: string;
  social_links?: string[];
  gallery?: string[];
  video_link?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function parseSocialLinks(links: string[] = []): { linkedin?: string; email?: string } {
  const linkedin = links.find((l) => l.toLowerCase().includes('linkedin.com'));
  const email = links.find(
    (l) => l.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l)
  );
  return { linkedin, email };
}

interface SpeakerDetailClientProps {
  locale: string;
  slug: string;
}

export function SpeakerDetailClient({ locale, slug }: SpeakerDetailClientProps) {
  const isRtl = locale === 'ar';

  const [speaker, setSpeaker] = useState<ApiSpeakerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    speakersApi
      .getBySlug(slug, locale)
      .then((res: unknown) => {
        const raw = (res as { data?: ApiSpeakerDetail })?.data ?? (res as ApiSpeakerDetail);
        setSpeaker(raw);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug, locale]);

  const { linkedin, email } = parseSocialLinks(speaker?.social_links);

  return (
    <>
      <Navbar locale={locale} />

      {loading && (
        <div className="flex min-h-[60vh] items-center justify-center bg-black">
          <span className="animate-pulse font-helvetica text-white/50">Loading...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex min-h-[60vh] items-center justify-center bg-black">
          <span className="font-helvetica text-white/50">
            Could not load speaker. Please try again later.
          </span>
        </div>
      )}

      {speaker && !loading && (
        <>
          <SpeakerDetailHeader
            name={speaker.name ?? ''}
            bio={speaker.bio ?? ''}
            description={speaker.description ?? ''}
            imageUrl={getImageUrl(speaker.speaker_image)}
            linkedinUrl={linkedin}
            emailUrl={email}
            isRtl={isRtl}
          />
          <SpeakerDetailAbout
            name={speaker.name ?? ''}
            brief={speaker.brief}
            experience={speaker.experience}
            isRtl={isRtl}
          />
          <SpeakerDetailGallery
            gallery={speaker.gallery ?? []}
            locale={locale}
          />
          <SpeakerDetailVideos
            videoLinks={speaker.video_link ?? []}
            locale={locale}
          />
        </>
      )}
    </>
  );
}
