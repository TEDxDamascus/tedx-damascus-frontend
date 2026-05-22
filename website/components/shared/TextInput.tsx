'use client';

/**
 * TextInput — matches Figma Form/Text Input (node 1-10676).
 *
 * Works with react-hook-form via `register` spread or standalone as a
 * controlled input. States: default, focused, typing, filled, valid,
 * error, disabled — all derived automatically from props/interaction.
 *
 * Usage with RHF:
 *   const { register, formState: { errors } } = useForm<Schema>();
 *   <TextInput {...register('email')} label="Email" error={errors.email?.message} />
 *
 * Usage controlled:
 *   <TextInput value={val} onChange={...} label="Name" isValid={isValidated} />
 */

import { forwardRef, useState, useId } from 'react';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Floating label shown above the input once the field has a value or focus */
  label?: string;
  /** Error message — turns the underline red and shows an inline error */
  error?: string;
  /** Shows a green underline + check icon when true and the field has a value */
  isValid?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, error, isValid, disabled, className, onFocus, onBlur, onChange, value, defaultValue, ...rest },
    ref,
  ) {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);

    // Track local fill state for uncontrolled (RHF register) usage
    const [localFilled, setLocalFilled] = useState(Boolean(defaultValue));

    // Controlled inputs pass `value`; uncontrolled (RHF) don't
    const hasValue =
      value !== undefined ? Boolean(value) : localFilled;

    const isError = Boolean(error);
    const showLabel = Boolean(label && (hasValue || isFocused || isError));
    const showValid = isValid && hasValue && !isError && !isFocused;

    // Underline appearance
    const underlineBg = disabled
      ? 'bg-[#363636]'
      : isError
      ? 'bg-[#eb0028]'
      : isFocused
      ? 'bg-[#eb0028]'
      : showValid
      ? 'bg-[#00eb4e]'
      : 'bg-[#525252]';

    const underlineStyle =
      isFocused && !isError
        ? { boxShadow: '0px 1px 5px 0px rgba(235,0,40,0.4)' }
        : undefined;

    return (
      <div className={`flex flex-col gap-2 items-start w-full ${className ?? ''}`}>

        {/* Label */}
        {showLabel && (
          <label
            htmlFor={id}
            className={`font-helvetica text-base leading-normal select-none transition-colors ${
              disabled ? 'text-[#777]' : 'text-[#e0e0e0]'
            }`}
          >
            {label}
          </label>
        )}

        {/* Input row + underline */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center px-[10px] gap-2 w-full">
            <input
              ref={ref}
              id={id}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
              onChange={(e) => {
                if (value === undefined) setLocalFilled(Boolean(e.target.value));
                onChange?.(e);
              }}
              aria-invalid={isError || undefined}
              aria-describedby={isError ? `${id}-error` : undefined}
              className={[
                'font-helvetica text-base leading-normal flex-1 min-w-0',
                'bg-transparent border-none outline-none',
                'text-[#bebebe] placeholder:text-[rgba(255,255,255,0.4)]',
                'disabled:text-[rgba(255,255,255,0.24)] disabled:cursor-not-allowed',
                'caret-[#eb0028]',
              ].join(' ')}
              {...rest}
            />

            {/* Valid check icon */}
            {showValid && (
              <div
                aria-hidden
                className="shrink-0 w-5 h-5 rounded-full bg-[rgba(0,235,78,0.24)] flex items-center justify-center"
              >
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden>
                  <path
                    d="M1 4.5L3.8 7.5L10 1"
                    stroke="#00eb4e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Underline */}
          <div
            className={`h-px w-full transition-colors duration-150 ${underlineBg}`}
            style={underlineStyle}
          />
        </div>

        {/* Error message */}
        {isError && (
          <div
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-2 w-full"
          >
            <svg
              aria-hidden
              className="shrink-0 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#eb0028"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#eb0028" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="17" r="0.5" fill="#eb0028" stroke="#eb0028" strokeWidth="1" />
            </svg>
            <span className="font-helvetica text-xs text-[#680010]">{error}</span>
          </div>
        )}
      </div>
    );
  },
);
