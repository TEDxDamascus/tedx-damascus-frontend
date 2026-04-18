import { Controller } from 'react-hook-form';
import { FormControlLabel, Switch, Grid, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { parse, format, isValid } from 'date-fns';
import { LocaleInput, localeInputTypes } from '../../../../shared-components/locale-input';
import { CustomAutocomplete } from '../../../../shared-components/custom-autocomplete';
import { ImagePickerField } from '../../../../shared-components/image-picker';
import { searchSpeakerOptions } from '../../../speakers-app/SpeakersApi';

const pickerSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
  '& .MuiIconButton-root': { color: 'var(--color-primary)' },
};

function BasicInfoTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textField}
                label="Event Title"
                required
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => {
              const dateValue = field.value
                ? (() => { const d = parse(field.value, 'yyyy-MM-dd', new Date()); return isValid(d) ? d : null; })()
                : null;
              return (
                <DatePicker
                  label="Event Date *"
                  value={dateValue}
                  onChange={(newDate) =>
                    field.onChange(newDate && isValid(newDate) ? format(newDate, 'yyyy-MM-dd') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date?.message,
                    },
                  }}
                  sx={pickerSx}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="time"
            control={control}
            render={({ field }) => {
              const timeValue = field.value
                ? (() => { const d = parse(field.value, 'HH:mm', new Date()); return isValid(d) ? d : null; })()
                : null;
              return (
                <TimePicker
                  label="Event Time"
                  value={timeValue}
                  onChange={(newTime) =>
                    field.onChange(newTime && isValid(newTime) ? format(newTime, 'HH:mm') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.time,
                      helperText: errors.time?.message,
                    },
                  }}
                  sx={pickerSx}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textField}
                label="Location / City"
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImagePickerField
                value={field.value}
                onChange={field.onChange}
                label="Event Cover Image"
                error={!!errors.image}
                helperText={errors.image?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="speakers"
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                scope="event-speakers"
                fetchOptions={searchSpeakerOptions}
                multiple
                label="Event Speakers"
                placeholder="Search speakers..."
                error={errors.speakers}
                helperText={errors.speakers?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="brief"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textFieldMultiple}
                label="Brief (optional)"
                minRows={2}
                error={!!errors.brief}
                helperText={errors.brief?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textFieldMultiple}
                label="Event Description"
                minRows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value === 'active'}
                    onChange={(e) => field.onChange(e.target.checked ? 'active' : 'upcoming')}
                  />
                }
                label="Event is Live (Active)"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Published"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicInfoTab;
