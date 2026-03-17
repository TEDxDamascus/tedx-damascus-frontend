import { Controller } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocaleInput, localeInputTypes } from '../../../shared-components/locale-input';
import RichTextEditor from '../../../shared-components/rich-text-editor';
import { TARGET_ROLES } from './questionUtils';

// Two rich text editors side by side (EN left, AR right) — same pattern as LocaleField
function LocaleRichTextEditor({ value = { en: '', ar: '' }, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-400">EN</span>
        <div dir="ltr">
          <RichTextEditor
            value={value.en ?? ''}
            onChange={(html) => onChange({ ...value, en: html })}
            placeholder="Description (English)"
          />
        </div>
      </div>
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-400">AR</span>
        <div dir="rtl">
          <RichTextEditor
            value={value.ar ?? ''}
            onChange={(html) => onChange({ ...value, ar: html })}
            placeholder="الوصف (العربية)"
          />
        </div>
      </div>
    </div>
  );
}

export default function FormSettings({ control }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Form Name</label>
        <Controller
          name="name"
          control={control}
          rules={{ validate: (v) => !!(v?.en?.trim() || v?.ar?.trim()) || 'Name is required' }}
          render={({ field, fieldState }) => (
            <LocaleInput
              {...field}
              label="Name"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              required
            />
          )}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <LocaleRichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Target Role</label>
        <Controller
          name="targetRole"
          control={control}
          render={({ field }) => (
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: 'var(--color-primary)' } }}>
                Role
              </InputLabel>
              <Select
                {...field}
                label="Role"
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary)',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: 'rgba(235, 0, 40, 0.08)',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: 'rgba(235, 0, 40, 0.05)',
                      },
                    },
                  },
                }}
              >
                {TARGET_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
