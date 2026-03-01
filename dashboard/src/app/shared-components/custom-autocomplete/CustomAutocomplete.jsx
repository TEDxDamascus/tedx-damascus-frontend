import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import {
  selectAutocompleteScope,
  setInputValue,
  createDebouncedFetch
} from './autocompleteSlice';
import { getOptionLabel, isOptionEqualToValue } from './autocompleteUtils';

/**
 * Custom Autocomplete – scope-based, debounced fetch, RHF-ready.
 * Use with Controller: <Controller name="x" control={control} render={({ field }) => <CustomAutocomplete {...field} scope="..." fetchOptions={...} />} />
 *
 * @param {string} scope - Unique key for Redux state (e.g. 'speaker', 'volunteer')
 * @param {Function} fetchOptions - async (query) => Promise<options[]>
 * @param {boolean} [multiple] - Single or multi selection
 * @param {string} [label] - Input label
 * @param {string} [placeholder] - Input placeholder
 * @param {string} [helperText] - Static helper text (shown when no error)
 * @param {boolean} [error] - Error state (from RHF)
 * @param {object|object[]} value - Selected value(s) – from RHF field.value
 * @param {Function} onChange - (value) => void – from RHF field.onChange
 */
function CustomAutocomplete({
  scope,
  fetchOptions,
  multiple = false,
  label,
  placeholder,
  helperText,
  error: externalError,
  value,
  onChange,
  getOptionLabel: customGetOptionLabel,
  isOptionEqualToValue: customIsOptionEqualToValue,
  disabled,
  required,
  ...rest
}) {
  const dispatch = useDispatch();
  const { inputValue, options, loading, error: scopeError } = useSelector(
    selectAutocompleteScope(scope)
  );
  const debouncedFetchRef = useRef(null);

  if (!debouncedFetchRef.current) {
    debouncedFetchRef.current = createDebouncedFetch(dispatch);
  }
  const debouncedFetch = debouncedFetchRef.current;

  useEffect(() => {
    if (inputValue !== undefined && inputValue !== null && fetchOptions) {
      debouncedFetch({ scope, query: inputValue, fetchOptionsFn: fetchOptions });
    }
  }, [inputValue, scope, fetchOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (event, newInputValue) => {
    dispatch(setInputValue({ scope, value: newInputValue }));
  };

  const getLabel = customGetOptionLabel ?? getOptionLabel;
  const isEqual = customIsOptionEqualToValue ?? isOptionEqualToValue;
  const hasError = !!externalError || !!scopeError;

  // Ensure selected value(s) appear in options (e.g. when loading from form reset)
  const valueArr = multiple && Array.isArray(value) ? value : value ? [value] : [];
  const valueIds = new Set(valueArr.map((v) => v?.id ?? v?.value).filter(Boolean));
  const optionsWithValue = [
    ...valueArr.filter(Boolean),
    ...options.filter((o) => !valueIds.has(o?.id ?? o?.value))
  ];
  const errorMessage = scopeError || (externalError?.message ?? (typeof externalError === 'string' ? externalError : null));
  const displayHelperText = errorMessage || helperText;

  return (
    <Box>
      <Autocomplete
        multiple={multiple}
        value={value ?? (multiple ? [] : null)}
        onChange={(event, newValue) => onChange?.(newValue)}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={optionsWithValue}
        loading={loading}
        getOptionLabel={getLabel}
        isOptionEqualToValue={isEqual}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            error={hasError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        noOptionsText={loading ? 'Loading...' : 'No results'}
        {...rest}
      />
      {displayHelperText && (
        <FormHelperText error={hasError} sx={{ mt: 0.5, mx: 1.75 }}>
          {displayHelperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CustomAutocomplete;
