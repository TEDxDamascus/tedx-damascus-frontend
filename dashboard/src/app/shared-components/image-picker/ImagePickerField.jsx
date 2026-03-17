import { useState } from 'react';
import { Image } from '@mui/icons-material';
import ImagePickerDialog from './ImagePickerDialog';

export default function ImagePickerField({
  value,
  onChange,
  label = 'Image',
  error,
  helperText,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const hasValue = !!value;

  return (
    <>
      <div className="flex items-stretch gap-3">
        {/* Thumbnail — same height as the input row */}
        <div className="flex w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
          {hasValue ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image className="text-gray-300" style={{ fontSize: 24 }} />
          )}
        </div>

        {/* URL input + browse */}
        <div className="flex-1">
          <div
            className={[
              'flex items-center overflow-hidden rounded border bg-white',
              error ? 'border-red-500' : 'border-gray-300',
              disabled || hasValue ? 'opacity-70' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || hasValue}
              placeholder={label}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none disabled:cursor-default disabled:select-none"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={disabled}
              className="border-l border-gray-200 px-3 py-2 text-xs font-semibold text-tedx-red transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {hasValue ? 'Change' : 'Browse'}
            </button>
          </div>
          {helperText && (
            <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-400'}`}>
              {helperText}
            </p>
          )}
        </div>
      </div>

      <ImagePickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        currentUrl={value ?? ''}
      />
    </>
  );
}
