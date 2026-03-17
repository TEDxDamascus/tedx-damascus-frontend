import { useState } from 'react';
import {
  Add,
  ShortText,
  Notes,
  RadioButtonChecked,
  CheckBox,
  ArrowDropDownCircle,
  Star,
  CalendarMonth,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { QUESTION_TYPES } from './questionUtils';

const TYPE_ICONS = {
  short_text: <ShortText style={{ fontSize: 22 }} />,
  long_text: <Notes style={{ fontSize: 22 }} />,
  multiple_choice: <RadioButtonChecked style={{ fontSize: 22 }} />,
  checkboxes: <CheckBox style={{ fontSize: 22 }} />,
  dropdown: <ArrowDropDownCircle style={{ fontSize: 22 }} />,
  rating: <Star style={{ fontSize: 22 }} />,
  date: <CalendarMonth style={{ fontSize: 22 }} />,
};

export default function AddQuestionPanel({ onAdd, isAdding }) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type) => {
    setOpen(false);
    onAdd(type);
  };

  return (
    <div>
      {open ? (
        <div className="rounded-xl border border-dashed border-tedx-red bg-red-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-600">Choose question type</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUESTION_TYPES.map(({ type, label, description, disabled }) => (
              <button
                key={type}
                onClick={() => !disabled && handleAdd(type)}
                disabled={isAdding || disabled}
                title={disabled ? 'Coming soon' : undefined}
                className={[
                  'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors',
                  disabled
                    ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-40'
                    : 'border-gray-200 bg-white hover:border-tedx-red hover:bg-red-50',
                  isAdding ? 'opacity-50' : '',
                ].join(' ')}
              >
                <span className={disabled ? 'text-gray-300' : 'text-tedx-red'}>
                  {TYPE_ICONS[type]}
                </span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
                <span className="text-xs text-gray-400">{description}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600"
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
