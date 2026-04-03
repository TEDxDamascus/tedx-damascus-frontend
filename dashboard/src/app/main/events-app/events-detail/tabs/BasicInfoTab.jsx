import { Controller } from 'react-hook-form';
import { TextField, FormControlLabel, Switch, Grid, Box } from '@mui/material';
import { LocaleInput, localeInputTypes } from '../../../../shared-components/locale-input';
import {
  CustomAutocomplete,
  normalizeOption,
} from '../../../../shared-components/custom-autocomplete';
import { ImagePickerField } from '../../../../shared-components/image-picker';
import axiosInstance from '@/app/services/axiosInstance';

async function fetchSpeakerOptions(query) {
  const res = await axiosInstance.get('/speakers', {
    params: query ? { q: query } : undefined,
  });
  return res.data.data.map((s) => normalizeOption({ id: s.id, label: s.name.en || s.name.ar }));
}

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
            render={({ field }) => (
              <TextField
                {...field}
                label="Event Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Event Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.time}
                helperText={errors.time?.message}
              />
            )}
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

        <Grid item xs={12} md={6}>
          <Controller
            name="venue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Venue (Hall/Building)"
                fullWidth
                error={!!errors.venue}
                helperText={errors.venue?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="ticketsLink"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tickets Link (URL)"
                fullWidth
                error={!!errors.ticketsLink}
                helperText={errors.ticketsLink?.message}
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
                fetchOptions={fetchSpeakerOptions}
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
