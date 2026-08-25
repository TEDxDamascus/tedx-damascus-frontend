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
  innerFrontImage?: string;
  middleImage: string;
  backImage?: string;
}

const MILESTONE_IMAGES: Array<{ front: string; middle: string; back?: string; innerFront?: string }> = [
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
    front: '/images/about/our-story/Partnership and Surveys.png',
    middle: '/images/about/our-story/bg-partners.png',
  },
  {
    front: '/images/about/our-story/m4-team-group-selfie.png',
    middle: '/images/about/our-story/bg-5 (2).png',
  },
  {
    front: '/images/about/our-story/TEDx AlQassaa launches on social media.png',
    middle: '/images/about/our-story/bg-TEDx AlQassaa launches on social media.png',
  },
  {
    front: '/images/about/our-story/IMAGE-section7.png',
    middle: '/images/about/our-story/BG-7.png',
    back: '/images/about/our-story/BG-1-7.png',
  },
  {
    front: '/images/about/our-story/Section8.png',
    middle: '/images/about/our-story/Section8.png',
  },
  {
    // Social-media card (section 9.png) shown fully on the dark venue background (bg-section 9.png).
    front: '/images/about/our-story/section 9.png',
    middle: '/images/about/our-story/bg-section 9.png',
  },
  {
    // Q&A session: close-up shot on top, wider venue angle as background.
    front: '/images/about/our-story/secton10.png',
    middle: '/images/about/our-story/bg-10.png',
  },
  {
    // Event title announcement: TEDx AlQassaa logo card.
    front: '/images/about/our-story/section 11.png',
    middle: '/images/about/our-story/section 11.png',
  },
  {
    // Speaker auditions ended: photo of the audition session.
    front: '/images/about/our-story/section 12.png',
    middle: '/images/about/our-story/section 12.png',
  },
  {
    // Partnerships: social-media card on colorful background.
    front: '/images/about/our-story/section 13.png',
    middle: '/images/about/our-story/bg-13.png',
  },
  {
    // Volunteer team announcement: grid of volunteer portraits.
    front: '/images/about/our-story/section 14.png',
    middle: '/images/about/our-story/section 14.png',
  },
  {
    // Main event: three stacked event photos. bg-1-15 furthest back, bg-2-15 above it, section15 on top.
    front: '/images/about/our-story/section15.png',
    middle: '/images/about/our-story/bg-2-15.png',
    back: '/images/about/our-story/bg-1-15.png',
  },
  {
    // TEDx Salons: three stacked salon photos. bg-1-16 furthest back, bg-2-16 above it, section 16 on top.
    front: '/images/about/our-story/section 16.png',
    middle: '/images/about/our-story/bg-2-16.png',
    back: '/images/about/our-story/bg-1-16.png',
  },
  {
    // Civil Society salon: group photo up front with two salon photos peeking behind.
    front: '/images/about/our-story/section 17.png',
    middle: '/images/about/our-story/bg-2-17.png',
    back: '/images/about/our-story/bg-1-17.png',
  },
  {
    // Syrian History salon: group photo up front with two salon photos peeking behind.
    front: '/images/about/our-story/section 18.png',
    middle: '/images/about/our-story/bg-2-18.png',
    back: '/images/about/our-story/bg-1-18.png',
  },
  {
    // Freedom.. New Paths: speaker-cards grid up front with two training photos peeking behind.
    front: '/images/about/our-story/section 19.png',
    middle: '/images/about/our-story/bg-2-19.png',
    back: '/images/about/our-story/bg-1-19.png',
  },
  {
    // TEDxDamascus 2026: the stage key-visual contained on top of its own blurred backdrop.
    front: '/images/about/our-story/section 20.png',
    middle: '/images/about/our-story/bg-20.png',
  },
];

interface OurStoryProps {
  locale: string;
}

/** Each milestone's own photos, in click-through order — powers that milestone's full-screen carousel lightbox. */
const MILESTONE_IMAGE_LISTS: string[][] = MILESTONE_IMAGES.map((m) =>
  [m.front, m.middle, m.back].filter((src): src is string => Boolean(src)),
);
/** Local index of each photo within its own milestone's image list, matching `MILESTONE_IMAGE_LISTS`. */
const IMAGE_INDICES: Array<{ front: number; middle: number; back?: number }> = MILESTONE_IMAGES.map((m) => {
  const entry: { front: number; middle: number; back?: number } = { front: 0, middle: 1 };
  if (m.back) entry.back = 2;
  return entry;
});

/** Three photos stacked directly above one another, the back two peeking out past the top edge, matching the Figma reference. `back` is optional for milestones with only two source photos. Each photo opens the full-screen carousel lightbox on click. */
function MilestoneImageStack({
  front,
  innerFront,
  middle,
  back,
  flip,
  noRotate,
  containFront,
  frontScale,
  frontRotate,
  peekOffset = 6,
  wide,
  bgTop,
  bgScale = 'scale-x-[1.4]',
  roundedClass = 'rounded-2xl',
  cardBg,
  indices,
  onImageClick,
}: {
  front: string;
  middle: string;
  back?: string;
  flip: boolean;
  innerFront?: string;
  noRotate?: boolean;
  containFront?: boolean;
  frontScale?: string;
  /** Optional Tailwind rotation class for the front card, e.g. '-rotate-[4deg]', to create a scattered look. */
  frontRotate?: string;
  /** How many Tailwind spacing units the back images peek above the front card. Default 6 (24px). */
  peekOffset?: 6 | 10 | 14 | 20;
  /** Wider card variant for single landscape photos (e.g. section 8). */
  wide?: boolean;
  /** Align background image to the top instead of center. */
  bgTop?: boolean;
  /** Tailwind scale class for the background image. Default 'scale-x-[1.4]'. */
  bgScale?: string;
  /** Tailwind rounded classes for the card. Default 'rounded-2xl'. Can use per-corner classes e.g. 'rounded-2xl rounded-tr-[48px]'. */
  roundedClass?: string;
  /** Optional Tailwind bg class for the inner card (shows when front uses object-contain). */
  cardBg?: string;
  indices: { front: number; middle: number; back?: number };
  onImageClick: (index: number) => void;
}) {

  if (noRotate) {
    // Flat layout: background fills the card, front image is contained on top of it.
    return (
      <div className={wide ? 'relative w-[300px] lg:w-[420px]' : 'relative w-[260px] lg:w-[330px]'}>
        <div className={`relative h-[210px] overflow-hidden lg:h-[260px] ${roundedClass} ${cardBg ?? ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={middle}
            alt=""
            className={`absolute inset-0 h-full w-full cursor-pointer object-cover ${bgScale} ${bgTop ? 'object-top' : ''}`}
            draggable={false}
            onClick={() => onImageClick(indices.middle)}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={front}
            alt=""
            className={['absolute inset-0 h-full w-full cursor-pointer', (containFront || frontScale) ? `object-contain ${frontScale ?? ''}` : 'object-cover'].join(' ').trim()}
            draggable={false}
            onClick={() => onImageClick(indices.front)}
          />
        </div>
      </div>
    );
  }

  // Map peekOffset to Tailwind classes — must be complete strings so Tailwind can detect them statically.
  const peekClasses: Record<number, { pt: string; backTop: string; midTop: string; gradient: string }> = {
    6:  { pt: 'pt-6',  backTop: '-top-6',  midTop: '-top-3',  gradient: '-top-6'  },
    10: { pt: 'pt-10', backTop: '-top-10', midTop: '-top-5',  gradient: '-top-10' },
    14: { pt: 'pt-14', backTop: '-top-14', midTop: '-top-7',  gradient: '-top-14' },
    20: { pt: 'pt-20', backTop: '-top-20', midTop: '-top-10', gradient: '-top-20' },
  };
  const pk = peekClasses[peekOffset];

  return (
    // Outer padding reserves layout height for the peeking photos so `items-center` balances against the text column.
    <div className={`relative ${wide ? 'w-[300px] lg:w-[380px]' : 'w-[260px] lg:w-[330px]'} ${pk.pt}`}>
      <div className={`relative ${wide ? 'h-[153px] lg:h-[194px]' : 'h-[210px] lg:h-[260px]'}`}>
        {back && (
          <div
            className={[
              `absolute inset-x-8 ${pk.backTop} h-full overflow-hidden rounded-2xl`,
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
            `absolute inset-x-4 ${pk.midTop} h-full overflow-hidden rounded-2xl`,
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
        <div className={`pointer-events-none absolute inset-x-0 ${pk.gradient} z-[1] h-3 bg-gradient-to-b from-page-bg/40 to-transparent`} />

        <div className={`absolute inset-0 z-[2] overflow-hidden rounded-2xl ${frontRotate ?? ''} ${containFront ? (cardBg ?? 'bg-[#1a1a1a]') : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={front}
            alt=""
            className={`h-full w-full cursor-pointer ${containFront ? `object-contain ${frontScale ?? ''}` : 'object-cover'}`}
            draggable={false}
            onClick={() => onImageClick(indices.front)}
          />
          {innerFront && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={innerFront}
              alt=""
              className="absolute inset-0 h-full w-full cursor-pointer object-contain p-3"
              draggable={false}
              onClick={() => onImageClick(indices.front)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function OurStory({ locale }: OurStoryProps) {
  const t = useTranslations('OurStory');
  const isRtl = locale === 'ar';
  const [lightbox, setLightbox] = useState<{ milestone: number; index: number } | null>(null);

  const milestones: Milestone[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((n, i) => ({
    date: t(`m${n}Date`),
    before: t(`m${n}Before`),
    highlight: t(`m${n}Highlight`),
    after: t(`m${n}After`),
    desc: t(`m${n}Desc`),
    year: t(`m${n}Date`).split('.').pop() ?? '',
    frontImage: MILESTONE_IMAGES[i].front,
    innerFrontImage: MILESTONE_IMAGES[i].innerFront,
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
          {/* Center timeline line — desktop only; on mobile each milestone gets its own connector below. */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/15 lg:block"
            aria-hidden
          />

          <div className="flex flex-col gap-0 lg:gap-24">
            {milestones.map((m, i) => {
              // Sections 16, 18 & 20 keep their image on the left and sections 17 & 19 on the right to match the Figma, breaking the alternating pattern.
              const imageOnStart = i === 15 || i === 17 || i === 19 ? true : i === 16 || i === 18 ? false : i % 2 === 0;
              // Rotation direction for the peeking cards (and matching scattered front tilt on the salon sections).
              const flip = i === 14 || i === 15 ? imageOnStart : !imageOnStart;
              // Slide in toward the center timeline: the left column comes from further left, the right column from further right.
              const textX = imageOnStart ? 50 : -50;
              const imageX = imageOnStart ? -50 : 50;
              return (
                <div key={m.date + i} className="flex w-full flex-col items-center">
                <div className="relative flex w-full flex-col items-center gap-5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-14">
                  {/* Ghost year number — flat #1A1A1A fill at 70% opacity, per Figma dev-mode export. Sits behind the text and card stack. Desktop only. */}
                  <span
                    className={[
                      'pointer-events-none absolute top-1/2 -z-10 hidden -translate-y-1/2 select-none font-helvetica font-black leading-none text-[#1A1A1A]/70 lg:block',
                      'text-[110px] lg:text-[160px]',
                      imageOnStart ? 'right-0 lg:right-8' : 'left-0 lg:left-8',
                    ].join(' ')}
                    aria-hidden
                  >
                    {m.year}
                  </span>

                  {/* Timeline ellipse marker — desktop only (mobile uses the connector below). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/our-story/timeline-ellipse.svg"
                    alt=""
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 lg:block"
                    aria-hidden
                    draggable={false}
                  />

                  <MotionReveal
                    x={textX}
                    className={[
                      'order-2 w-full max-w-[450px] px-2 text-start',
                      'lg:order-none lg:row-start-1 lg:px-0 lg:text-start',
                      imageOnStart
                        ? 'lg:col-start-2 lg:justify-self-start lg:ps-8'
                        : 'lg:col-start-1 lg:justify-self-end lg:pe-8 lg:text-end',
                    ].join(' ')}
                  >
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 font-helvetica text-[11px] tracking-[0.15px] text-white/70">
                      {m.date}
                    </span>
                    <h3
                      className={[
                        'mt-3 font-helvetica font-normal leading-[1.3] text-[#f1f1f1]',
                        i === 10 || i === 12
                          ? 'text-2xl lg:text-[31px] lg:leading-[1.3] lg:tracking-[0.2px]'
                          : 'text-2xl lg:text-[34px] lg:leading-[1.235] lg:tracking-[0.25px]',
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
                          'mt-2 font-helvetica text-sm leading-[1.6] text-[#a8a8a8]',
                          isRtl ? 'font-arabic' : '',
                        ].join(' ')}
                      >
                        {m.desc}
                      </p>
                    )}
                  </MotionReveal>

                  <MotionReveal
                    delay={0.15}
                    x={imageX}
                    className={[
                      'order-1',
                      imageOnStart
                        ? 'lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:me-10'
                        : 'lg:order-none lg:col-start-2 lg:row-start-1 lg:justify-self-start lg:ms-10',
                    ].join(' ')}
                  >
                    <MilestoneImageStack
                      front={m.frontImage}
                      innerFront={m.innerFrontImage}
                      middle={m.middleImage}
                      back={m.backImage}
                      flip={flip}
                      noRotate={i === 3 || i === 5 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11 || i === 12 || i === 13 || i === 19}
                      containFront={i === 5 || i === 8 || i === 9 || i === 12 || i === 13 || i === 15 || i === 16 || i === 17 || i === 18}
                      frontScale={i === 5 ? 'scale-[1.2]' : i === 8 ? 'scale-[1.35]' : i === 9 ? 'object-bottom scale-[1.05]' : i === 12 ? 'scale-[1.5]' : i === 19 ? 'scale-[1.2]' : undefined}
                      frontRotate={i === 15 || i === 16 || i === 17 || i === 18 ? (flip ? 'rotate-[3deg]' : '-rotate-[3deg]') : undefined}
                      peekOffset={i === 6 ? 10 : i === 14 || i === 15 || i === 16 || i === 17 || i === 18 ? 14 : 6}
                      wide={i === 7 || i === 9 || i === 10 || i === 11 || i === 13 || i === 15 || i === 16 || i === 17 || i === 18 || i === 19}
                      bgTop={i === 9}
                      bgScale={i === 9 ? 'scale-[0.95]' : i === 12 ? 'scale-x-[1.8]' : i === 13 ? 'opacity-0' : i === 19 ? 'scale-[1.05]' : 'scale-x-[1.4]'}
                      cardBg={i === 13 ? 'bg-[#1a1a1a]' : undefined}
                      roundedClass={i === 9 ? 'rounded-2xl rounded-tr-[48px]' : 'rounded-2xl'}
                      indices={IMAGE_INDICES[i]}
                      onImageClick={(index) => setLightbox({ milestone: i, index })}
                    />
                  </MotionReveal>
                </div>

                  {/* Mobile-only timeline connector (line + red ellipse) sitting in the gap between milestones. */}
                  {i < milestones.length - 1 && (
                    <div className="flex flex-col items-center py-2 lg:hidden" aria-hidden>
                      <div className="h-8 w-px bg-white/15" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/about/our-story/timeline-ellipse.svg"
                        alt=""
                        className="my-1 h-[56px] w-[56px]"
                        draggable={false}
                      />
                      <div className="h-8 w-px bg-white/15" />
                    </div>
                  )}
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
        images={lightbox ? MILESTONE_IMAGE_LISTS[lightbox.milestone] : []}
        initialIndex={lightbox?.index ?? 0}
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}
