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
import { CircularProgress, Switch, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { getTypeLabel, hasOptions, isSection } from './questionUtils';
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

// ─── Shared input style ───────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tedx-red';

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
          className={inputCls}
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
            className={inputCls}
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
            className={inputCls}
          />
        </div>
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Min</label>
          <input
            type="number"
            value={config.min ?? ''}
            onChange={(e) => update('min', e.target.value !== '' ? Number(e.target.value) : '')}
            placeholder="No limit"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Max</label>
          <input
            type="number"
            value={config.max ?? ''}
            onChange={(e) => update('max', e.target.value !== '' ? Number(e.target.value) : '')}
            placeholder="No limit"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Step</label>
          <input
            type="number"
            min={0.01}
            value={config.step ?? ''}
            onChange={(e) => update('step', e.target.value !== '' ? Number(e.target.value) : '')}
            placeholder="1"
            className={inputCls}
          />
        </div>
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
        <Switch
          size="small"
          checked={!!config.country_code_required}
          onChange={(e) => update('country_code_required', e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-primary)' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'var(--color-primary)',
            },
          }}
        />
        <span className="text-sm text-gray-600">Require country code</span>
      </div>
    );
  }

  if (type === 'rating') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Min</label>
            <input
              type="number"
              min={0}
              value={config.min ?? 1}
              onChange={(e) => update('min', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Max</label>
            <input
              type="number"
              min={2}
              max={10}
              value={config.max ?? 5}
              onChange={(e) => update('max', Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Step</label>
            <input
              type="number"
              min={1}
              value={config.step ?? 1}
              onChange={(e) => update('step', Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Min Label</label>
          <LocaleField
            label="Min label"
            value={config.min_label ?? { en: '', ar: '' }}
            onChange={(v) => update('min_label', v)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Max Label</label>
          <LocaleField
            label="Max label"
            value={config.max_label ?? { en: '', ar: '' }}
            onChange={(v) => update('max_label', v)}
          />
        </div>
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

  if (type === 'date_range') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Min Date</label>
          <input
            type="date"
            value={config.min_date ?? ''}
            onChange={(e) => update('min_date', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Max Date</label>
          <input
            type="date"
            value={config.max_date ?? ''}
            onChange={(e) => update('max_date', e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    );
  }

  if (type === 'file_upload') {
    const allowedTypes = config.allowed_types ?? [];
    const toggleType = (t) => {
      const next = allowedTypes.includes(t)
        ? allowedTypes.filter((x) => x !== t)
        : [...allowedTypes, t];
      update('allowed_types', next);
    };
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-500">Allowed File Types</label>
          <div className="flex flex-wrap gap-2">
            {['pdf', 'jpg', 'png', 'docx', 'mp4', 'xlsx'].map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:border-tedx-red"
              >
                <input
                  type="checkbox"
                  checked={allowedTypes.includes(t)}
                  onChange={() => toggleType(t)}
                  className="accent-tedx-red"
                />
                <span className="font-medium uppercase text-gray-600">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Max Size (MB)</label>
            <input
              type="number"
              min={1}
              value={config.max_size_mb ?? ''}
              onChange={(e) =>
                update('max_size_mb', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="10"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Max Files</label>
            <input
              type="number"
              min={1}
              value={config.max_files ?? ''}
              onChange={(e) =>
                update('max_files', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="1"
              className={inputCls}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'yes_no') {
    const current =
      config.default_value === null || config.default_value === undefined
        ? ''
        : String(config.default_value);
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Default Value</label>
        <ToggleButtonGroup
          exclusive
          value={current}
          onChange={(_, val) => {
            if (val === null) return;
            update('default_value', val === '' ? null : val === 'true');
          }}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontSize: 13,
              px: 2,
              borderColor: '#e0e0e0',
              color: '#555',
            },
            '& .MuiToggleButton-root.Mui-selected': {
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              borderColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
            },
          }}
        >
          <ToggleButton value="">No default</ToggleButton>
          <ToggleButton value="true">Yes</ToggleButton>
          <ToggleButton value="false">No</ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }

  if (type === 'section') {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <div className="border-t-2 border-gray-300" />
        <p className="mt-2 text-xs text-gray-400">
          This element acts as a visual section break. Use the title and description fields above to
          set its heading and subtitle.
        </p>
      </div>
    );
  }

  return null;
}

const hasConfig = (type) =>
  [
    'short_text',
    'long_text',
    'number',
    'phone',
    'rating',
    'date',
    'date_range',
    'file_upload',
    'yes_no',
    'section',
  ].includes(type);

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
  const sectionType = isSection(local.type);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* ── Accordion header ── */}
        <div
          className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Type badge */}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              sectionType ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {getTypeLabel(local.type)}
          </span>

          {!sectionType && <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>}

          {titlePreview ? (
            <span className="flex-1 truncate text-sm text-gray-800">{titlePreview}</span>
          ) : (
            <span className="flex-1" />
          )}

          {local.isRequired && !sectionType && (
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
            {/* Question label / Section title */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                {sectionType ? 'Section Title' : 'Question Label'}
              </label>
              <LocaleField
                label={sectionType ? 'Section title' : 'Question'}
                value={local.title}
                onChange={(val) => save({ ...local, title: val })}
              />
            </div>

            {/* Help text / Section description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                {sectionType ? 'Section Description' : 'Help Text'}{' '}
                <span className="font-normal normal-case text-gray-300">(optional)</span>
              </label>
              <LocaleField
                label={sectionType ? 'Description' : 'Help text'}
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

            {/* Required toggle — hidden for section */}
            {!sectionType && (
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
            )}
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
        title={sectionType ? 'Delete Section' : 'Delete Question'}
        description={`Are you sure you want to delete ${sectionType ? 'this section' : `Q${index + 1}`}${titlePreview ? ` "${titlePreview}"` : ''}? This cannot be undone.`}
      />
    </>
  );
}
