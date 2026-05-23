import { useState } from 'react';
import {
  Add,
  ShortText,
  Notes,
  Numbers,
  AlternateEmail,
  Phone,
  Link,
  RadioButtonChecked,
  CheckBox,
  Star,
  CalendarMonth,
  DateRange,
  CloudUpload,
  ToggleOn,
  HorizontalRule,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { QUESTION_TYPES } from './questionUtils';

const TYPE_ICONS = {
  short_text: <ShortText style={{ fontSize: 22 }} />,
  long_text: <Notes style={{ fontSize: 22 }} />,
  number: <Numbers style={{ fontSize: 22 }} />,
  email: <AlternateEmail style={{ fontSize: 22 }} />,
  phone_number: <Phone style={{ fontSize: 22 }} />,
  url: <Link style={{ fontSize: 22 }} />,
  single_choice: <RadioButtonChecked style={{ fontSize: 22 }} />,
  checkbox_group: <CheckBox style={{ fontSize: 22 }} />,
  rating: <Star style={{ fontSize: 22 }} />,
  date: <CalendarMonth style={{ fontSize: 22 }} />,
  date_range: <DateRange style={{ fontSize: 22 }} />,
  file_upload: <CloudUpload style={{ fontSize: 22 }} />,
  yes_no: <ToggleOn style={{ fontSize: 22 }} />,
  section: <HorizontalRule style={{ fontSize: 22 }} />,
};

const TYPE_GROUPS = [
  {
    label: 'Text & Input',
    types: ['short_text', 'long_text', 'number', 'email', 'phone_number', 'url'],
  },
  {
    label: 'Choice',
    types: ['single_choice', 'checkbox_group', 'yes_no'],
  },
  {
    label: 'Date & File',
    types: ['date', 'date_range', 'file_upload'],
  },
  {
    label: 'Other',
    types: ['rating', 'section'],
  },
];

const DISABLED_TYPES = new Set(['number', 'email']);

export default function AddQuestionPanel({ onAdd, isAdding, disabled }) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type) => {
    setOpen(false);
    onAdd(type);
  };

  const typeMap = Object.fromEntries(QUESTION_TYPES.map((t) => [t.type, t]));

  return (
    <div>
      {open ? (
        <div className="rounded-xl border border-dashed border-tedx-red bg-red-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-600">Choose question type</p>

          <div className="space-y-4">
            {TYPE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {group.types.map((type) => {
                    const def = typeMap[type];
                    if (!def) return null;
                    const typeDisabled = isAdding || DISABLED_TYPES.has(type);
                    return (
                      <button
                        key={type}
                        onClick={() => !DISABLED_TYPES.has(type) && handleAdd(type)}
                        disabled={typeDisabled}
                        className={[
                          'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors',
                          DISABLED_TYPES.has(type)
                            ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-40'
                            : 'border-gray-200 bg-white hover:border-tedx-red hover:bg-red-50',
                          isAdding && !DISABLED_TYPES.has(type) ? 'opacity-50' : '',
                        ].join(' ')}
                      >
                        <span
                          className={DISABLED_TYPES.has(type) ? 'text-gray-400' : 'text-tedx-red'}
                        >
                          {TYPE_ICONS[type]}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">{def.label}</span>
                        <span className="text-xs text-gray-400">{def.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          disabled={isAdding || disabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-tedx-red hover:text-tedx-red disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isAdding ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <Add style={{ fontSize: 18 }} />
          )}
          Add Question
        </button>
      )}
    </div>
  );
}
