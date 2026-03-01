/**
 * Debounce – delays execution until after wait ms of no invocations.
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Delay in ms (default 300)
 * @returns {Function} Debounced function
 */
export function debounce(fn, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Normalize option for MUI Autocomplete.
 * Expects option to have id and label (or name used as label).
 * @param {object} option - Raw option
 * @returns {object} { id, label }
 */
export function normalizeOption(option) {
  if (!option) return null;
  return {
    ...option,
    id: option.id ?? option.value,
    label: option.label ?? option.name ?? option.title ?? String(option.id ?? option.value ?? '')
  };
}

/**
 * Default getOptionLabel for MUI Autocomplete.
 */
export function getOptionLabel(option) {
  if (!option) return '';
  return option.label ?? option.name ?? option.title ?? String(option.id ?? option.value ?? '');
}

/**
 * Default isOptionEqualToValue for MUI Autocomplete.
 */
export function isOptionEqualToValue(option, value) {
  if (!option || !value) return false;
  const optId = option.id ?? option.value;
  const valId = value.id ?? value.value;
  return optId === valId;
}
