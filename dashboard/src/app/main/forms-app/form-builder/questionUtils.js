export const QUESTION_TYPES = [
  { type: 'short_text', label: 'Short Text', description: 'Single-line text answer' },
  { type: 'long_text', label: 'Long Text', description: 'Multi-line text answer' },
  { type: 'multiple_choice', label: 'Single Choice', description: 'Coming soon', disabled: true },
  { type: 'checkboxes', label: 'Multiple Choice', description: 'Coming soon', disabled: true },
  { type: 'dropdown', label: 'Dropdown', description: 'Coming soon', disabled: true },
  { type: 'rating', label: 'Rating', description: 'Coming soon', disabled: true },
  { type: 'date', label: 'Date', description: 'Coming soon', disabled: true },
];

const CHOICE_TYPES = ['multiple_choice', 'checkboxes', 'dropdown'];

export function hasOptions(type) {
  return CHOICE_TYPES.includes(type);
}

export function getTypeLabel(type) {
  return QUESTION_TYPES.find((t) => t.type === type)?.label ?? type;
}

export function createQuestion(type, orderIndex = 0) {
  return {
    orderIndex,
    type,
    title: { en: '', ar: '' },
    helpText: { en: '', ar: '' },
    isRequired: false,
    config: {},
    options: hasOptions(type)
      ? [
          { label: { en: 'Option 1', ar: 'الخيار 1' } },
          { label: { en: 'Option 2', ar: 'الخيار 2' } },
        ]
      : [],
  };
}

export const TARGET_ROLES = ['Speaker', 'Attender', 'Volunteer', 'Sponsor', 'Partner'];
