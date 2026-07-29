'use client';

import { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api/client';
import { EventDetailsHero } from './EventDetailsHero';
import { EventDetailsAbout } from './EventDetailsAbout';
import { EventDetailsSpeakers } from './EventDetailsSpeakers';
import { EventDetailsGallery } from './EventDetailsGallery';
import { EventDetailsVenue } from './EventDetailsVenue';

/* ─── Shared types ───────────────────────────────────────── */

type Localizable = string | { en: string; ar: string };

export interface ApiSpeaker {
  _id?: string;
  name?: Localizable;
  title?: Localizable;
  image?: string;
  photo?: string;
}

export interface ApiEventDetail {
  _id: string;
  slug?: string;
  title: Localizable;
  event_type?: string;
  event_image?: string;
  status: string;
  brief?: string;
  description: Localizable;
  location?: Localizable;
  location_description?: Localizable;
  location_address?: Localizable;
  location_email?: string;
  location_phone?: string;
  coordinates?: [number, number];
  start_time?: string;
  end_time?: string;
  date?: string;
  gallery?: string[];
  speakers?: ApiSpeaker[];
  volunteers_count?: number;
}

export function localizeField(value: Localizable | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return locale === 'ar' ? (value.ar ?? value.en ?? '') : (value.en ?? value.ar ?? '');
}

/* ─── Static event data ──────────────────────────────────── */

const STATIC_EVENTS: Record<string, ApiEventDetail> = {
  'from-war-to-big-dreams': {
    _id: 'from-war-to-big-dreams',
    slug: 'from-war-to-big-dreams',
    title: {
      en: 'FROM WAR TO BIG DREAMS: SYRIAN ADULTS DREW THEIR ROAD DESPITE EVERY SINGLE OBSTACLE',
      ar: 'من الحرب إلى الأحلام الكبيرة: السوريون رسموا طريقهم رغم كل العقبات',
    },
    status: 'past',
    description: {
      en: "The journey of TEDx Damascus has always been about discovery and the power of human connection. In our upcoming event, 'From War to Big Dreams', we delve into the extraordinary resilience of the Syrian spirit. Over the past decade, Syrian adults have navigated through unprecedented challenges, yet their capacity for innovation and dreaming remains unbroken.\n\nThis event brings together visionary speakers who have transformed obstacles into stepping stones. From technological breakthroughs born in crisis to artistic expressions that defy conflict, we explore the road drawn by those who refused to let their dreams be silenced by the echoes of war.",
      ar: "دائمًا ما كانت رحلة TEDx دمشق تدور حول الاكتشاف وقوة التواصل الإنساني. في فعاليتنا 'من الحرب إلى الأحلام الكبيرة'، نتعمق في صمود الروح السورية غير العادي. على مدى العقد الماضي، واجه السوريون تحديات غير مسبوقة، ومع ذلك ظلت قدرتهم على الابتكار والحلم راسخة.\n\nتجمع هذه الفعالية متحدثين رؤيويين حولوا العقبات إلى حجارة أساس. من الاختراقات التكنولوجية المولودة في أزمات إلى التعبيرات الفنية التي تتحدى الصراع، نستكشف الطريق الذي رسمه أولئك الذين رفضوا السماح لأحلامهم بالصمت.",
    },
    location: { en: 'Damascus Opera House', ar: 'دار الأوبرا دمشق' },
    location_description: {
      en: 'A beacon of art and culture in the heart of Damascus. The Opera House provides a grand setting that echoes our theme of resilience and beauty.',
      ar: 'منارة للفن والثقافة في قلب دمشق. توفر دار الأوبرا محيطًا رائعًا يتردد صدى موضوعنا عن المرونة والجمال.',
    },
    location_address: { en: 'Umayyeen Square, Damascus, Syria', ar: 'ساحة الأمويين، دمشق، سوريا' },
    location_email: 'info@tedxdamascus.com',
    location_phone: '+963 11 123 4567',
    date: '2024-01-16',
    coordinates: [36.2910, 33.5138],
    speakers: [
      {
        _id: 's1',
        name: { en: 'Jenna Smith', ar: 'جينا سميث' },
        title: { en: 'AI Ethics & Future Tech', ar: 'أخلاقيات الذكاء الاصطناعي وتكنولوجيا المستقبل' },
        image: '/images/event-details/speaker-1.png',
      },
      {
        _id: 's2',
        name: { en: 'Robert P. Stones', ar: 'روبرت ستونز' },
        title: { en: 'Architectural Innovation', ar: 'الابتكار المعماري' },
        image: '/images/event-details/speaker-2.png',
      },
      {
        _id: 's3',
        name: { en: 'Peter Jones', ar: 'بيتر جونز' },
        title: { en: 'Global Sustainability', ar: 'الاستدامة العالمية' },
        image: '/images/event-details/speaker-3.png',
      },
      {
        _id: 's4',
        name: { en: 'Mary Lou', ar: 'ماري لو' },
        title: { en: 'Doctoral Heritage Tech', ar: 'تكنولوجيا التراث الأكاديمي' },
        image: '/images/event-details/speaker-4.png',
      },
      {
        _id: 's5',
        name: { en: 'Jenna Smith', ar: 'جينا سميث' },
        title: { en: 'AI Ethics & Future Tech', ar: 'أخلاقيات الذكاء الاصطناعي' },
        image: '/images/event-details/speaker-1.png',
      },
      {
        _id: 's6',
        name: { en: 'Robert P. Stones', ar: 'روبرت ستونز' },
        title: { en: 'Architectural Innovation', ar: 'الابتكار المعماري' },
        image: '/images/event-details/speaker-2.png',
      },
      {
        _id: 's7',
        name: { en: 'Peter Jones', ar: 'بيتر جونز' },
        title: { en: 'Global Sustainability', ar: 'الاستدامة العالمية' },
        image: '/images/event-details/speaker-3.png',
      },
      {
        _id: 's8',
        name: { en: 'Mary Lou', ar: 'ماري لو' },
        title: { en: 'Doctoral Heritage Tech', ar: 'تكنولوجيا التراث' },
        image: '/images/event-details/speaker-4.png',
      },
    ],
    gallery: [
      '/images/event-details/gallery-1.png',
      '/images/event-details/gallery-2.png',
      '/images/event-details/gallery-3.png',
      '/images/event-details/gallery-4.png',
      '/images/event-details/gallery-3.png',
      '/images/event-details/gallery-2.png',
    ],
    volunteers_count: 1200,
  },

  'tedx-damascus-2026': {
    _id: 'tedx-damascus-2026',
    slug: 'tedx-damascus-2026',
    title: {
      en: 'DAMASCUS: WHERE THE STORY IS TOLD ANEW',
      ar: 'دمشق: حيث تُروى الحكاية من جديد',
    },
    status: 'upcoming',
    description: {
      en: "The journey of TEDx Damascus has always been about discovery and the power of human connection. In our upcoming event, \"From War to Big Dreams\", we delve into the extraordinary resilience of the Syrian spirit. Over the past decade, Syrian adults have navigated through unprecedented challenges, yet their capacity for innovation and dreaming remains unbroken.\n\nThis event brings together visionary speakers who have transformed obstacles into stepping stones. From technological breakthroughs born in crisis to artistic expressions that defy conflict, we explore the road drawn by those who refused to let their dreams be silenced by the echoes of war.",
      ar: "دائمًا ما كانت رحلة TEDx دمشق تدور حول الاكتشاف وقوة التواصل الإنساني. في فعاليتنا القادمة \"من الحرب إلى الأحلام الكبيرة\"، نتعمق في صمود الروح السورية غير العادي. على مدى العقد الماضي، واجه السوريون تحديات غير مسبوقة، ومع ذلك ظلت قدرتهم على الابتكار والحلم راسخة لا تتزعزع.\n\nتجمع هذه الفعالية متحدثين رؤيويين حولوا العقبات إلى حجارة أساس. من الاختراقات التكنولوجية المولودة في أزمات إلى التعبيرات الفنية التي تتحدى الصراع، نستكشف الطريق الذي رسمه أولئك الذين رفضوا السماح لأحلامهم بالصمت أمام أصداء الحرب.",
    },
    location: { en: 'Damascus Opera House', ar: 'دار الأوبرا دمشق' },
    location_description: {
      en: 'A beacon of art and culture in the heart of Damascus. The Opera House provides a grand setting that echoes our theme of resilience and beauty.',
      ar: 'منارة للفن والثقافة في قلب دمشق. توفر دار الأوبرا محيطًا رائعًا يتردد صدى موضوعنا.',
    },
    location_address: { en: 'Umayyeen Square, Damascus, Syria', ar: 'ساحة الأمويين، دمشق، سوريا' },
    location_email: 'info@tedxdamascus.com',
    location_phone: '+963 11 123 4567',
    date: '2026-09-01',
    coordinates: [36.2910, 33.5138],
    speakers: [
      {
        _id: 's1',
        name: { en: 'Jenna Smith', ar: 'جينا سميث' },
        title: { en: 'AI Ethics & Future Tech', ar: 'أخلاقيات الذكاء الاصطناعي وتكنولوجيا المستقبل' },
        image: '/images/event-details/speaker-1.png',
      },
      {
        _id: 's2',
        name: { en: 'Robert P. Stones', ar: 'روبرت ستونز' },
        title: { en: 'Architectural Innovation', ar: 'الابتكار المعماري' },
        image: '/images/event-details/speaker-2.png',
      },
      {
        _id: 's3',
        name: { en: 'Peter Jones', ar: 'بيتر جونز' },
        title: { en: 'Global Sustainability', ar: 'الاستدامة العالمية' },
        image: '/images/event-details/speaker-3.png',
      },
      {
        _id: 's4',
        name: { en: 'Mary Lou', ar: 'ماري لو' },
        title: { en: 'Doctoral Heritage Tech', ar: 'تكنولوجيا التراث الأكاديمي' },
        image: '/images/event-details/speaker-4.png',
      },
      {
        _id: 's5',
        name: { en: 'Jenna Smith', ar: 'جينا سميث' },
        title: { en: 'AI Ethics & Future Tech', ar: 'أخلاقيات الذكاء الاصطناعي' },
        image: '/images/event-details/speaker-1.png',
      },
      {
        _id: 's6',
        name: { en: 'Robert P. Stones', ar: 'روبرت ستونز' },
        title: { en: 'Architectural Innovation', ar: 'الابتكار المعماري' },
        image: '/images/event-details/speaker-2.png',
      },
      {
        _id: 's7',
        name: { en: 'Peter Jones', ar: 'بيتر جونز' },
        title: { en: 'Global Sustainability', ar: 'الاستدامة العالمية' },
        image: '/images/event-details/speaker-3.png',
      },
      {
        _id: 's8',
        name: { en: 'Mary Lou', ar: 'ماري لو' },
        title: { en: 'Doctoral Heritage Tech', ar: 'تكنولوجيا التراث' },
        image: '/images/event-details/speaker-4.png',
      },
    ],
    gallery: [
      '/images/event-details/gallery-1.png',
      '/images/event-details/gallery-2.png',
      '/images/event-details/gallery-3.png',
      '/images/event-details/gallery-4.png',
      '/images/event-details/gallery-3.png',
      '/images/event-details/gallery-2.png',
    ],
    volunteers_count: 1200,
  },
};

const DEFAULT_EVENT = STATIC_EVENTS['from-war-to-big-dreams'];

function toSlugLocal(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function extractEnTitle(value: Localizable | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.en ?? value.ar ?? '';
}

function eventToSlug(e: ApiEventDetail): string {
  if (e.slug) return e.slug;
  const enTitle = extractEnTitle(e.title);
  return enTitle ? toSlugLocal(enTitle) : String(e._id);
}

function getCachedEvent(slug: string): ApiEventDetail | null {
  try {
    const raw = localStorage.getItem(`tedx_event_${slug}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return (data && (data._id || data.id)) ? data : null;
  } catch {
    return null;
  }
}

/* ─── Component ──────────────────────────────────────────── */

interface EventDetailsClientProps {
  locale: string;
  slug: string;
}

function EventDetailsInner({ locale, slug }: EventDetailsClientProps) {
  const [event, setEvent] = useState<ApiEventDetail>(
    () => getCachedEvent(slug) ?? STATIC_EVENTS[slug] ?? DEFAULT_EVENT
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await eventsApi.getAll({});
        const list: ApiEventDetail[] = Array.isArray(res)
          ? res
          : ((res as { data?: ApiEventDetail[] })?.data ?? []);

        const match = list.find((e) => eventToSlug(e) === slug || String(e._id) === slug);
        if (match) {
          setEvent(match);
          try { localStorage.setItem(`tedx_event_${slug}`, JSON.stringify(match)); } catch {}
        }
      } catch { /* keep cached/static fallback */ }
    };
    load();
  }, [slug]);

  const speakers = event.speakers ?? [];
  const gallery = event.gallery ?? [];

  return (
    <>
      <EventDetailsHero locale={locale} slug={slug} event={event} />
      <EventDetailsAbout locale={locale} event={event} />
      {speakers.length > 0 && (
        <EventDetailsSpeakers locale={locale} speakers={speakers} />
      )}
      {gallery.length > 0 && (
        <EventDetailsGallery locale={locale} gallery={gallery} />
      )}
      <EventDetailsVenue locale={locale} event={event} />
    </>
  );
}

export function EventDetailsClient({ locale, slug }: EventDetailsClientProps) {
  return <EventDetailsInner locale={locale} slug={slug} />;
}
