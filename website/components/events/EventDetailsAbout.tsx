import type { ApiEventDetail } from './EventDetailsClient';
import { localizeField } from './EventDetailsClient';

/* ─── Fallback static content ─────────────────────────────── */

const FALLBACK_PARAGRAPHS = [
  'The journey of TEDx Damascus has always been about discovery and the power of human connection. In our upcoming event, we delve into the extraordinary resilience of the Syrian spirit. Over the past decade, Syrian adults have navigated through unprecedented challenges, yet their capacity for innovation and dreaming remains unbroken.',
];

const FALLBACK_PARAGRAPHS_AR = [
  'دائمًا ما كانت رحلة TEDx دمشق تدور حول الاكتشاف وقوة التواصل الإنساني. في فعاليتنا القادمة، نتعمق في صمود الروح السورية غير العادي. على مدى العقد الماضي، واجه السوريون تحديات غير مسبوقة، ومع ذلك ظلت قدرتهم على الابتكار والحلم راسخة لا تتزعزع.',
];

/* ─── Section ────────────────────────────────────────────── */

interface EventDetailsAboutProps {
  locale?: string;
  event: ApiEventDetail | null;
}

export function EventDetailsAbout({ locale, event }: EventDetailsAboutProps) {
  const isRtl = locale === 'ar';

  // Description from API (split on double newline into paragraphs)
  let paragraphs: string[];
  if (event) {
    const raw = localizeField(event.description, locale ?? 'en');
    paragraphs = raw.split(/\n\n+/).filter(Boolean);
    if (!paragraphs.length) paragraphs = [raw];
  } else {
    paragraphs = isRtl ? FALLBACK_PARAGRAPHS_AR : FALLBACK_PARAGRAPHS;
  }

  // Stats from API
  const speakerCount = event?.speakers?.length ?? 0;
  const volunteerCount = event?.volunteers_count ?? 0;

  const stats = [
    ...(speakerCount > 0
      ? [{ value: String(speakerCount), label: 'INSPIRING SPEAKERS', labelAr: 'متحدثون ملهمون' }]
      : []),
    ...(volunteerCount > 0
      ? [{ value: String(volunteerCount), label: 'VOLUNTEERS', labelAr: 'متطوعون' }]
      : []),
  ];

  return (
    <section
      className="w-full bg-[var(--page-bg)] px-[clamp(1.5rem,6vw,5.5rem)] py-[80px]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-x-6">

          {/* ── Left: heading ── */}
          <div className="lg:col-span-4">
            <h2
              className={[
                'font-helvetica font-bold uppercase text-primary',
                'text-[40px] leading-[1.1] tracking-[-0.25px]',
                'sm:text-[48px] lg:text-[57px] lg:leading-[64px]',
              ].join(' ')}
            >
              {isRtl ? <>عن<br />الفعالية</> : <>ABOUT THE<br />EVENT</>}
            </h2>
          </div>

          {/* ── Right: description + stats ── */}
          <div className="flex flex-col gap-4 lg:col-span-8">
            {paragraphs.map((text, i) => (
              <p
                key={i}
                className="font-helvetica text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[#f1f1f1]"
              >
                {text}
              </p>
            ))}

            {stats.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={[
                      'flex flex-col gap-2 py-8',
                      isRtl
                        ? 'border-r-4 border-primary pr-9 pl-8'
                        : 'border-l-4 border-primary pl-9 pr-8',
                      'bg-[#121212]',
                    ].join(' ')}
                  >
                    <span className="font-sans text-[56px] font-black leading-[56px] text-white">
                      {stat.value}
                    </span>
                    <span className="font-sans text-[12px] font-bold uppercase tracking-[1.2px] text-white/40">
                      {isRtl ? stat.labelAr : stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
