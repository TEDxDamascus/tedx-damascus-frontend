'use client';

import { useId } from 'react';

export interface MultipleChoiceOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultipleChoiceProps {
  options: MultipleChoiceOption[];
  /** 'radio' = single select, 'checkbox' = multi select */
  mode?: 'radio' | 'checkbox';
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export function MultipleChoice({
  options,
  mode = 'radio',
  value,
  onChange,
  label,
  disabled,
  className,
  name: nameProp,
}: MultipleChoiceProps) {
  const baseId = useId();
  const groupName = nameProp ?? baseId;

  const selectedValues: string[] = Array.isArray(value)
    ? value
    : value != null
    ? [value]
    : [];

  const isSelected = (optValue: string) => selectedValues.includes(optValue);

  const handleChange = (optValue: string) => {
    if (disabled) return;
    if (mode === 'radio') {
      onChange?.(optValue);
    } else {
      const next = isSelected(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(next);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${className ?? ''}`}
      role={mode === 'radio' ? 'radiogroup' : 'group'}
      aria-labelledby={label ? `${baseId}-label` : undefined}
    >
      {label && (
        <p id={`${baseId}-label`} className="text-[#e0e0e0] font-helvetica text-base leading-normal">
          {label}
        </p>
      )}

      {options.map((opt, idx) => {
        const itemId = `${baseId}-${idx}`;
        const checked = isSelected(opt.value);
        const isDisabled = disabled || opt.disabled;

        return (
          <label
            key={opt.value}
            htmlFor={itemId}
            className={`flex items-center gap-5 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} select-none`}
          >
            {/* Hidden native input for accessibility + form compatibility */}
            <input
              id={itemId}
              type={mode === 'radio' ? 'radio' : 'checkbox'}
              name={mode === 'radio' ? groupName : `${groupName}-${idx}`}
              value={opt.value}
              checked={checked}
              onChange={() => handleChange(opt.value)}
              disabled={isDisabled}
              className="sr-only"
            />

            {/* Custom indicator */}
            {mode === 'radio' ? (
              <span
                aria-hidden
                className={[
                  'w-6 h-6 rounded-full border shrink-0 flex items-center justify-center transition-colors',
                  checked
                    ? isDisabled
                      ? 'border-[rgba(54,54,54,0.6)]'
                      : 'border-[rgba(235,0,40,0.6)]'
                    : isDisabled
                    ? 'border-[#363636]'
                    : 'border-[#525252]',
                ].join(' ')}
              >
                {checked && (
                  <span
                    className={`w-5 h-5 rounded-full ${isDisabled ? 'bg-[#363636]' : 'bg-[#eb0028]'}`}
                  />
                )}
              </span>
            ) : (
              <span
                aria-hidden
                className={[
                  'w-6 h-6 rounded-sm border shrink-0 flex items-center justify-center transition-colors overflow-hidden',
                  checked
                    ? isDisabled
                      ? 'bg-[#363636] border-[#363636]'
                      : 'bg-[#eb0028] border-[#eb0028]'
                    : isDisabled
                    ? 'border-[#363636]'
                    : 'border-[#525252]',
                ].join(' ')}
              >
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M1.5 6l3 3 6-6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            )}

            <span
              className={`font-helvetica text-sm leading-normal ${
                isDisabled ? 'text-[#777]' : 'text-[#e0e0e0]'
              }`}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
