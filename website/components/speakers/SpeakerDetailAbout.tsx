'use client';

export interface SpeakerDetailAboutProps {
  name: string;
  brief?: string;
  experience?: string;
  isRtl: boolean;
}

export function SpeakerDetailAbout({
  name,
  brief,
  experience,
  isRtl,
}: SpeakerDetailAboutProps) {
  if (!brief && !experience) return null;

  return (
    <section
      className="bg-black px-[clamp(1rem,5vw,4rem)] pt-8 pb-8 sm:pt-10 sm:pb-10"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-[1180px] flex flex-col gap-12 sm:pl-[0px] lg:pl-[60px]">

        {/* ── Who is [name]? ── */}
        {brief && (
          <div className="flex flex-col gap-4">
            <h2
              className={[
                'text-primary font-bold text-xl sm:text-2xl leading-snug',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              {isRtl ? `من هو ${name}؟` : `Who is ${name}?`}
            </h2>
            <p
              className={[
                'text-white/80 text-sm sm:text-base font-normal leading-relaxed max-w-[700px]',
                isRtl ? 'font-arabic' : 'font-sans',
              ].join(' ')}
            >
              {brief}
            </p>
          </div>
        )}


        {/* ── Experience and Vision ── */}
        {experience && (
          <div className="flex flex-col gap-4">
            <h2
              className={[
                'text-white font-bold text-xl sm:text-2xl leading-snug',
                isRtl ? 'font-arabic' : 'font-helvetica',
              ].join(' ')}
            >
              {isRtl ? 'الخبرة والرؤية' : 'Experience and Vision'}
            </h2>
            <p
              className={[
                'text-white/80 text-sm sm:text-base font-normal leading-relaxed max-w-[700px] whitespace-pre-line',
                isRtl ? 'font-arabic' : 'font-sans',
              ].join(' ')}
            >
              {experience}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
