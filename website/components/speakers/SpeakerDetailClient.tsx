'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { speakersApi, getImageUrl } from '@/lib/api/client';
import { resolveSpeakerSlug } from '@/lib/speaker-slug';
import { useDocumentTitle } from '@/lib/use-document-title';
import { SpeakerDetailHeader } from './SpeakerDetailHeader';
import { SpeakerDetailAbout } from './SpeakerDetailAbout';
import { SpeakerDetailGallery } from './SpeakerDetailGallery';
import { SpeakerDetailVideos } from './SpeakerDetailVideos';

type LocaleString = string | { en?: string; ar?: string };

interface ContactInfo {
  address?: { en?: string; ar?: string } | string;
  phone?: string;
  email?: string;
}

interface ApiSpeakerDetail {
  _id?: string;
  name?: LocaleString;
  bio?: LocaleString;
  brief?: LocaleString;
  experience?: LocaleString;
  description?: LocaleString;
  slug?: LocaleString;
  speaker_image?: string;
  social_links?: string[];
  contact_info?: ContactInfo;
  gallery?: string[];
  video_link?: string | string[];
  createdAt?: string;
  updatedAt?: string;
}

function loc(field: LocaleString | undefined, lang: 'en' | 'ar'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field['en'] ?? '';
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function parseSocialLinks(
  links: string[] = [],
  contactInfo?: ContactInfo
): { linkedin?: string; facebook?: string; email?: string } {
  const linkedin = links.find((l) => l.toLowerCase().includes('linkedin.com'));
  const facebook = links.find((l) => l.toLowerCase().includes('facebook.com'));
  const emailFromLinks = links.find(
    (l) => l.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l)
  );
  const email = emailFromLinks ?? contactInfo?.email;
  return { linkedin, facebook, email };
}

interface SpeakerDetailClientProps {
  locale: string;
}

export function SpeakerDetailClient({ locale }: SpeakerDetailClientProps) {
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string }>();
  const slug = resolveSpeakerSlug(pathname, searchParams.get('slug'), params.slug);

  const [speaker, setSpeaker] = useState<ApiSpeakerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setSpeaker(null);
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    speakersApi
      .getAll({ limit: 500 })
      .then((res: unknown) => {
        const list: ApiSpeakerDetail[] = Array.isArray(res)
          ? res
          : ((res as { data?: ApiSpeakerDetail[] })?.data ?? []);

        const match = list.find((s) => {
          const enSlug = toSlug(loc(s.slug, 'en'));
          return enSlug === slug || String(s._id) === slug;
        });

        if (match) {
          setSpeaker(match);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const { linkedin, facebook } = parseSocialLinks(speaker?.social_links, speaker?.contact_info);
  useDocumentTitle(speaker ? loc(speaker.name, isRtl ? 'ar' : 'en') : undefined);

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
            name={loc(speaker.name, isRtl ? 'ar' : 'en')}
            bio={loc(speaker.bio, isRtl ? 'ar' : 'en')}
            description={loc(speaker.description, isRtl ? 'ar' : 'en')}
            imageUrl={getImageUrl(speaker.speaker_image)}
            linkedinUrl={linkedin}
            facebookUrl={facebook}
            isRtl={isRtl}
          />
          <SpeakerDetailAbout
            name={loc(speaker.name, isRtl ? 'ar' : 'en')}
            brief={loc(speaker.brief, isRtl ? 'ar' : 'en') || undefined}
            experience={loc(speaker.experience, isRtl ? 'ar' : 'en') || undefined}
            isRtl={isRtl}
          />
          <SpeakerDetailGallery
            gallery={speaker.gallery ?? []}
            locale={locale}
          />
          <SpeakerDetailVideos
            videoLinks={Array.isArray(speaker.video_link) ? speaker.video_link : speaker.video_link ? [speaker.video_link] : []}
            locale={locale}
          />
        </>
      )}
    </>
  );
}
