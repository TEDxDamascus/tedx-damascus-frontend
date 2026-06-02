'use client';

interface StepIndicatorProps {
  steps: string[];
  current: number; // 0-indexed
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-center py-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-start">
          {/* Connecting line before (except first) */}
          {i > 0 && (
            <div className="flex items-center mt-[18px] w-16 sm:w-24 md:w-32">
              <div
                className={`h-px w-full transition-colors duration-300 ${
                  i <= current ? 'bg-primary' : 'border-t border-dashed border-[#525252]'
                }`}
              />
            </div>
          )}

          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={[
                'w-9 h-9 rounded-full flex items-center justify-center font-helvetica text-sm font-bold transition-all duration-300',
                i < current
                  ? 'bg-primary text-white'
                  : i === current
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'border-2 border-[#525252] text-[#525252]',
              ].join(' ')}
            >
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 7l3.5 3.5 6.5-7"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs font-helvetica whitespace-nowrap transition-colors ${
                i <= current ? 'text-white' : 'text-[#525252]'
              }`}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
