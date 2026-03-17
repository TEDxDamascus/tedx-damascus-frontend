import { useState, useRef } from 'react';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  DeleteOutline,
  Add,
  Close,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { CircularProgress, Switch } from '@mui/material';
import { getTypeLabel, hasOptions } from './questionUtils';
import ConfirmModal from '../../../shared-components/confirm-modal';

// ─── Locale field (plain text) ───────────────────────────────────────────────
function LocaleField({ label, value = { en: '', ar: '' }, onChange, multiline = false }) {
  const Tag = multiline ? 'textarea' : 'input';
  const base =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red';

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-400">EN</span>
        <Tag
          className={`${base} ${multiline ? 'min-h-[72px] resize-y' : ''}`}
          dir="ltr"
          value={value.en ?? ''}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder={`${label} (English)`}
          rows={multiline ? 2 : undefined}
        />
      </div>
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-400">AR</span>
        <Tag
          className={`${base} ${multiline ? 'min-h-[72px] resize-y' : ''}`}
          dir="rtl"
          value={value.ar ?? ''}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          placeholder={`${label} (العربية)`}
          rows={multiline ? 2 : undefined}
        />
      </div>
    </div>
  );
}

// ─── Config fields per type ───────────────────────────────────────────────────
function ConfigFields({ type, config = {}, onChange }) {
  const update = (key, val) => onChange({ ...config, [key]: val });

  if (type === 'short_text') {
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Max Length</label>
        <input
          type="number"
          min={1}
          value={config.maxLength ?? ''}
          onChange={(e) => update('maxLength', e.target.value ? Number(e.target.value) : undefined)}
          placeholder="No limit"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
        />
      </div>
    );
  }

  if (type === 'long_text') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Max Length</label>
          <input
            type="number"
            min={1}
            value={config.maxLength ?? ''}
            onChange={(e) =>
              update('maxLength', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="No limit"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Visible Rows</label>
          <input
            type="number"
            min={2}
            max={20}
            value={config.rows ?? ''}
            onChange={(e) => update('rows', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Default (3)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
          />
        </div>
      </div>
    );
  }

  if (type === 'rating') {
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Max Rating</label>
        <select
          value={config.maxRating ?? 5}
          onChange={(e) => update('maxRating', Number(e.target.value))}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
        >
          <option value={5}>5 stars</option>
          <option value={10}>10 stars</option>
        </select>
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
        <Switch
          size="small"
          checked={!!config.includeTime}
          onChange={(e) => update('includeTime', e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-primary)' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'var(--color-primary)',
            },
          }}
        />
        <span className="text-sm text-gray-600">Include time picker</span>
      </div>
    );
  }

  return null;
}

const hasConfig = (type) => ['short_text', 'long_text', 'rating', 'date'].includes(type);

// ─── Main component ───────────────────────────────────────────────────────────
export default function QuestionCard({
  question,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isRemoving,
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [local, setLocal] = useState(question);
  const debounceRef = useRef(null);

  const save = (updated) => {
    setLocal(updated);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(question.id, updated), 600);
  };

  const handleOptionChange = (i, locale, val) => {
    const options = local.options.map((opt, idx) =>
      idx === i ? { ...opt, label: { ...opt.label, [locale]: val } } : opt,
    );
    save({ ...local, options });
  };

  const addOption = () => {
    save({
      ...local,
      options: [
        ...local.options,
        {
          label: {
            en: `Option ${local.options.length + 1}`,
            ar: `الخيار ${local.options.length + 1}`,
          },
        },
      ],
    });
  };

  const removeOption = (i) => {
    if (local.options.length <= 2) return;
    save({ ...local, options: local.options.filter((_, idx) => idx !== i) });
  };

  const titlePreview = local.title?.en || local.title?.ar || '';

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* ── Accordion header ── */}
        <div
          className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Type badge — amber/draft style */}
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {getTypeLabel(local.type)}
          </span>

          <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>

          {titlePreview ? (
            <span className="flex-1 truncate text-sm text-gray-800">{titlePreview}</span>
          ) : (
            <span className="flex-1" />
          )}

          {local.isRequired && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-tedx-red ring-1 ring-red-200">
              Required
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <KeyboardArrowUp style={{ fontSize: 18 }} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <KeyboardArrowDown style={{ fontSize: 18 }} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isRemoving}
              className="rounded p-1 text-red-400 hover:bg-red-50 disabled:opacity-50"
            >
              {isRemoving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <DeleteOutline style={{ fontSize: 18 }} />
              )}
            </button>
          </div>

          <span className="ml-1 text-gray-400">
            {expanded ? (
              <ExpandLess style={{ fontSize: 18 }} />
            ) : (
              <ExpandMore style={{ fontSize: 18 }} />
            )}
          </span>
        </div>

        {/* ── Expanded content ── */}
        {expanded && (
          <div className="space-y-5 border-t border-gray-100 px-4 pb-5 pt-4">
            {/* Question label */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Question Label
              </label>
              <LocaleField
                label="Question"
                value={local.title}
                onChange={(val) => save({ ...local, title: val })}
              />
            </div>

            {/* Help text */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Help Text <span className="font-normal normal-case text-gray-300">(optional)</span>
              </label>
              <LocaleField
                label="Help text"
                value={local.helpText}
                onChange={(val) => save({ ...local, helpText: val })}
              />
            </div>

            {/* Options for choice types */}
            {hasOptions(local.type) && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Options
                </label>
                <div className="space-y-2">
                  {local.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
                        dir="ltr"
                        value={opt.label?.en ?? ''}
                        onChange={(e) => handleOptionChange(i, 'en', e.target.value)}
                        placeholder="English"
                      />
                      <input
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red"
                        dir="rtl"
                        value={opt.label?.ar ?? ''}
                        onChange={(e) => handleOptionChange(i, 'ar', e.target.value)}
                        placeholder="العربية"
                      />
                      <button
                        onClick={() => removeOption(i)}
                        disabled={local.options.length <= 2}
                        className="rounded p-1 text-gray-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Close style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-tedx-red hover:underline"
                >
                  <Add style={{ fontSize: 14 }} /> Add option
                </button>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <Switch
                    size="small"
                    checked={!!local.config?.allowOther}
                    onChange={(e) =>
                      save({ ...local, config: { ...local.config, allowOther: e.target.checked } })
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-primary)' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'var(--color-primary)',
                      },
                    }}
                  />
                  <span className="text-sm text-gray-600">Allow &ldquo;Other&rdquo; answer</span>
                </div>
              </div>
            )}

            {/* Type-specific config */}
            {hasConfig(local.type) && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Configuration
                </label>
                <ConfigFields
                  type={local.type}
                  config={local.config}
                  onChange={(config) => save({ ...local, config })}
                />
              </div>
            )}

            {/* Required — prominent bottom toggle */}
            <div className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-tedx-red bg-red-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-tedx-red">Required field</p>
                <p className="text-xs text-red-400">
                  Users must answer this question before submitting.
                </p>
              </div>
              <Switch
                checked={local.isRequired}
                onChange={(e) => save({ ...local, isRequired: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-primary)' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'var(--color-primary)',
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          onRemove(question.id);
        }}
        loading={isRemoving}
        title="Delete Question"
        description={`Are you sure you want to delete Q${index + 1}${titlePreview ? ` "${titlePreview}"` : ''}? This cannot be undone.`}
      />
    </>
  );
}
