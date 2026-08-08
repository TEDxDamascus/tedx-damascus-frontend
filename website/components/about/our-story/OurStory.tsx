'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MotionReveal } from './MotionReveal';
import { ShareCommunityBar } from './ShareCommunityBar';
import { ImageLightbox } from './ImageLightbox';

interface Milestone {
  date: string;
  before: string;
  highlight: string;
  after: string;
  desc: string;
  year: string;
  frontImage: string;
  middleImage: string;
  backImage?: string;
}

const MILESTONE_IMAGES: Array<{ front: string; middle: string; back?: string }> = [
  {
    // The TED welcome email that licensed TEDx AlQassaa, with the two founders peeking behind it.
    front: '/images/about/our-story/m1-ted-welcome-email.png',
    middle: '/images/about/our-story/m1-founder-portrait-woman.png',
    back: '/images/about/our-story/m1-founder-portrait-man.png',
  },
  {
    // The social-media teaser card up front, with the volunteer-certificate photo and a "Coming soon 2024" teaser peeking behind.
    front: '/images/about/our-story/m2-tedx-alqassaa-teaser.png',
    middle: '/images/about/our-story/m2-m3-volunteer-certificates-trio.png',
    back: '/images/about/our-story/m2-coming-soon-2024.jpg',
  },
  {
    // The volunteer-certificate photo takes center stage here, backed by the full team-card grid and a second certificate photo.
    front: '/images/about/our-story/m2-m3-volunteer-certificates-trio.png',
    middle: '/images/about/our-story/m3-team-cards-grid.png',
    back: '/images/about/our-story/m3-volunteer-certificates-quartet.png',
  },
  {
    // Only two source photos for this milestone — the pottery-hands graphic explaining "Al-Qassaa", backed by the team group photo.
    front: '/images/about/our-story/m4-pottery-meaning.png',
    middle: '/images/about/our-story/m4-team-group-selfie.png',
  },
];

interface OurStoryProps {
  locale: string;
}

/** Flat, click-through order of every milestone photo, plus each milestone's index into that flat list — powers the full-screen carousel lightbox. */
const ALL_IMAGES: string[] = MILESTONE_IMAGES.flatMap((m) =>
  [m.front, m.middle, m.back].filter((src): src is string => Boolean(src)),
);
const IMAGE_INDICES: Array<{ front: number; middle: number; back?: number }> = (() => {
  let cursor = 0;
  return MILESTONE_IMAGES.map((m) => {
    const entry: { front: number; middle: number; back?: number } = { front: cursor++, middle: cursor++ };
    if (m.back) entry.back = cursor++;
    return entry;
  });
})();

/** Three photos stacked directly above one another, the back two peeking out past the top edge, matching the Figma reference. `back` is optional for milestones with only two source photos. Each photo opens the full-screen carousel lightbox on click. */
function MilestoneImageStack({
  front,
  middle,
  back,
  flip,
  indices,
  onImageClick,
}: {
  front: string;
  middle: string;
  back?: string;
  flip: boolean;
  indices: { front: number; middle: number; back?: number };
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="relative mx-auto h-[190px] w-[240px] lg:h-[220px] lg:w-[280px]">
      {back && (
        <div
          className={[
            'absolute inset-x-8 -top-6 h-full overflow-hidden rounded-2xl',
            flip ? 'rotate-[8deg]' : '-rotate-[8deg]',
          ].join(' ')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={back}
            alt=""
            className="h-full w-full cursor-pointer object-cover"
            draggable={false}
            onClick={() => onImageClick(indices.back!)}
          />
        </div>
      )}

      <div
        className={[
          'absolute inset-x-4 -top-3 h-full overflow-hidden rounded-2xl',
          flip ? 'rotate-[4deg]' : '-rotate-[4deg]',
        ].join(' ')}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={middle}
          alt=""
          className="h-full w-full cursor-pointer object-cover"
          draggable={false}
          onClick={() => onImageClick(indices.middle)}
        />
      </div>

      {/* Soft fade blending the peeking photos into the page background — top only, not wrapped around the front card */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 z-[1] h-8 bg-gradient-to-b from-page-bg to-transparent" />

      <div className="absolute inset-0 z-[2] overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={front}
          alt=""
          className="h-full w-full cursor-pointer object-cover"
          draggable={false}
          onClick={() => onImageClick(indices.front)}
        />
      </div>
    </div>
  );
}

export function OurStory({ locale }: OurStoryProps) {
  const t = useTranslations('OurStory');
  const isRtl = locale === 'ar';
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const milestones: Milestone[] = [1, 2, 3, 4].map((n, i) => ({
    date: t(`m${n}Date`),
    before: t(`m${n}Before`),
    highlight: t(`m${n}Highlight`),
    after: t(`m${n}After`),
    desc: t(`m${n}Desc`),
    year: t(`m${n}Date`).split('.').pop() ?? '',
    frontImage: MILESTONE_IMAGES[i].front,
    middleImage: MILESTONE_IMAGES[i].middle,
    backImage: MILESTONE_IMAGES[i].back,
  }));

  return (
    <section
      className="relative overflow-hidden bg-page-bg"
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={`${t('titlePrefix')} ${t('titleHighlight')}`.trim()}
    >
      <div className="relative z-10">
        <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-16 lg:pt-20">

        <div className="relative">
          {/* Center timeline line */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/15"
            aria-hidden
          />

          <div className="flex flex-col gap-16 lg:gap-24">
            {milestones.map((m, i) => {
              const imageOnStart = i % 2 === 0;
              // Slide in toward the center timeline: the left column comes from further left, the right column from further right.
              const textX = imageOnStart ? 50 : -50;
              const imageX = imageOnStart ? -50 : 50;
              return (
                <div key={m.date + i} className="relative grid grid-cols-2 items-center gap-x-10">
                  {/* Ghost year number — flat #1A1A1A fill at 70% opacity, per Figma dev-mode export. Sits behind the text and card stack. */}
                  <span
                    className={[
                      'pointer-events-none absolute top-1/2 -z-10 -translate-y-1/2 select-none font-helvetica font-black leading-none text-[#1A1A1A]/70',
                      'text-[110px] lg:text-[160px]',
                      imageOnStart ? 'right-0 lg:right-8' : 'left-0 lg:left-8',
                    ].join(' ')}
                    aria-hidden
                  >
                    {m.year}
                  </span>

                  {/* Timeline ellipse marker */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/our-story/timeline-ellipse.svg"
                    alt=""
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2"
                    aria-hidden
                    draggable={false}
                  />

                  <MotionReveal
                    x={textX}
                    className={imageOnStart ? 'col-start-2' : 'col-start-1'}
                  >
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 font-helvetica text-[11px] tracking-[0.15px] text-white/70">
                      {m.date}
                    </span>
                    <h3
                      className={[
                        'mt-3 font-helvetica text-2xl font-normal leading-[1.3] text-[#f1f1f1] lg:text-[34px] lg:leading-[1.235] lg:tracking-[0.25px]',
                        isRtl ? 'font-arabic' : '',
                      ].join(' ')}
                    >
                      {m.before && <span>{m.before} </span>}
                      <span className="text-primary">{m.highlight}</span>
                      {m.after && <span> {m.after}</span>}
                    </h3>
                    {m.desc && (
                      <p
                        className={[
                          'mt-2 max-w-sm font-helvetica text-sm leading-[1.6] text-[#a8a8a8]',
                          isRtl ? 'font-arabic' : '',
                        ].join(' ')}
                      >
                        {m.desc}
                      </p>
                    )}
                  </MotionReveal>

                  <MotionReveal delay={0.15} x={imageX} className={imageOnStart ? 'col-start-1' : 'col-start-2'}>
                    <MilestoneImageStack
                      front={m.frontImage}
                      middle={m.middleImage}
                      back={m.backImage}
                      flip={!imageOnStart}
                      indices={IMAGE_INDICES[i]}
                      onImageClick={setLightboxIndex}
                    />
                  </MotionReveal>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <ShareCommunityBar
            locale={locale}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tedxdamascus.com'}/${locale}/about/our-story`}
          />
        </div>
        </div>
      </div>

      <ImageLightbox
        images={ALL_IMAGES}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  );
}
