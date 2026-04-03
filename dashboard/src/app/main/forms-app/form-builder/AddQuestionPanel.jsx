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
  ArrowDropDownCircle,
  DoneAll,
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
  phone: <Phone style={{ fontSize: 22 }} />,
  url: <Link style={{ fontSize: 22 }} />,
  radio: <RadioButtonChecked style={{ fontSize: 22 }} />,
  checkbox: <CheckBox style={{ fontSize: 22 }} />,
  select: <ArrowDropDownCircle style={{ fontSize: 22 }} />,
  multi_select: <DoneAll style={{ fontSize: 22 }} />,
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
    types: ['short_text', 'long_text', 'number', 'email', 'phone', 'url'],
  },
  {
    label: 'Choice',
    types: ['radio', 'checkbox', 'select', 'multi_select', 'yes_no'],
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

export default function AddQuestionPanel({ onAdd, isAdding }) {
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
                    return (
                      <button
                        key={type}
                        onClick={() => handleAdd(type)}
                        disabled={isAdding}
                        className={[
                          'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors',
                          'border-gray-200 bg-white hover:border-tedx-red hover:bg-red-50',
                          isAdding ? 'opacity-50' : '',
                        ].join(' ')}
                      >
                        <span className="text-tedx-red">{TYPE_ICONS[type]}</span>
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
          disabled={isAdding}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-tedx-red hover:text-tedx-red disabled:opacity-50"
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
