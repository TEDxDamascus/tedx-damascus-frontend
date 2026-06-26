import Image from 'next/image';
import { getImageUrl } from '@/lib/api/client';
import type { ApiSpeaker } from './EventDetailsClient';
import { localizeField } from './EventDetailsClient';

/* ─── Speaker card ───────────────────────────────────────── */

interface SpeakerCardProps {
  name: string;
  topic: string;
  img: string;
}

function SpeakerCard({ name, topic, img }: SpeakerCardProps) {
  return (
    <article className="flex flex-col overflow-hidden bg-[#121212] border border-[rgba(51,51,51,0.15)]">
      <div className="relative h-[340px] w-full shrink-0 overflow-hidden">
        <Image
          src={img}
          alt={name}
          fill
          className="object-cover object-top grayscale"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1 border-t border-[rgba(51,51,51,0.2)] px-4 py-4">
        <h3 className="font-sans text-[22px] font-semibold uppercase leading-8 text-white">
          {name}
        </h3>
        <p className="font-sans text-[11px] font-bold uppercase tracking-[1.2px] text-[rgba(198,198,199,0.6)]">
          {topic}
        </p>
      </div>
    </article>
  );
}

/* ─── Section ────────────────────────────────────────────── */

interface EventDetailsSpeakersProps {
  locale?: string;
  speakers: ApiSpeaker[];
}

export function EventDetailsSpeakers({ locale, speakers }: EventDetailsSpeakersProps) {
  if (!speakers.length) return null;

  const isRtl = locale === 'ar';

  return (
    <section
      className="w-full bg-[var(--page-bg)] px-[clamp(1.5rem,4vw,3rem)] py-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className={`mb-14 ${isRtl ? 'border-r-4 pr-5' : 'border-l-4 pl-5'} border-primary`}>
          <h2 className="font-sans text-[40px] font-bold uppercase tracking-[-0.48px] text-[#e2e2e2] sm:text-[48px]">
            {isRtl ? 'متحدثونا' : 'Our Speakers'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {speakers.map((s, i) => {
            const name = localizeField(s.name, locale ?? 'en') || 'Speaker';
            const topic = localizeField(s.title, locale ?? 'en');
            const img = getImageUrl(s.image ?? s.photo ?? null);
            return (
              <SpeakerCard key={s._id ?? i} name={name} topic={topic} img={img} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
