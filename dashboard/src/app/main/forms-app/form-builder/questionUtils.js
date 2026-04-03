export const QUESTION_TYPES = [
  { type: 'short_text', label: 'Short Text', description: 'Single-line text' },
  { type: 'long_text', label: 'Long Text', description: 'Multi-line text area' },
  { type: 'number', label: 'Number', description: 'Numeric input' },
  { type: 'email', label: 'Email', description: 'Email with validation' },
  { type: 'phone', label: 'Phone', description: 'Phone number' },
  { type: 'url', label: 'URL', description: 'URL with validation' },
  { type: 'radio', label: 'Single Choice', description: 'Radio button list' },
  { type: 'checkbox', label: 'Multiple Choice', description: 'Checkbox list' },
  { type: 'select', label: 'Dropdown', description: 'Single select' },
  { type: 'multi_select', label: 'Multi-Select', description: 'Multiple select' },
  { type: 'rating', label: 'Rating', description: 'Star / scale rating' },
  { type: 'date', label: 'Date', description: 'Date picker' },
  { type: 'date_range', label: 'Date Range', description: 'Start & end date' },
  { type: 'file_upload', label: 'File Upload', description: 'Upload files' },
  { type: 'yes_no', label: 'Yes / No', description: 'Boolean toggle' },
  { type: 'section', label: 'Section', description: 'Visual divider' },
];

const CHOICE_TYPES = ['radio', 'checkbox', 'select', 'multi_select'];

export function hasOptions(type) {
  return CHOICE_TYPES.includes(type);
}

export function isSection(type) {
  return type === 'section';
}

export function getTypeLabel(type) {
  return QUESTION_TYPES.find((t) => t.type === type)?.label ?? type;
}

function getDefaultConfig(type) {
  if (type === 'rating') {
    return {
      min: 1,
      max: 5,
      step: 1,
      min_label: { en: '', ar: '' },
      max_label: { en: '', ar: '' },
    };
  }
  if (type === 'number') return { min: '', max: '', step: '' };
  if (type === 'file_upload') {
    return { allowed_types: ['pdf', 'jpg', 'png'], max_size_mb: 10, max_files: 1 };
  }
  if (type === 'phone') return { country_code_required: false };
  return {};
}

export function createQuestion(type, orderIndex = 0) {
  return {
    orderIndex,
    type,
    title: { en: '', ar: '' },
    helpText: { en: '', ar: '' },
    isRequired: false,
    config: getDefaultConfig(type),
    options: hasOptions(type)
      ? [
          { label: { en: 'Option 1', ar: 'الخيار 1' } },
          { label: { en: 'Option 2', ar: 'الخيار 2' } },
        ]
      : [],
  };
}

export const TARGET_ROLES = ['Speaker', 'Attender', 'Volunteer', 'Sponsor', 'Partner'];
