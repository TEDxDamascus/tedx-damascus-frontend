import { Controller } from 'react-hook-form';
import { TextField, FormControlLabel, Switch, Grid, Box } from '@mui/material';
import { LocaleInput, localeInputTypes } from '../../../../shared-components/locale-input';
import {
  CustomAutocomplete,
  normalizeOption,
} from '../../../../shared-components/custom-autocomplete';
import { ImagePickerField } from '../../../../shared-components/image-picker';
import axiosInstance from '@/app/services/axiosInstance';

async function fetchTalkOptions(query) {
  const res = await axiosInstance.get('/talks', {
    params: query ? { q: query } : undefined,
  });
  return res.data.data.map((t) => normalizeOption({ id: t.id, label: t.title }));
}

function BasicInfoTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textField}
                label="Full Name"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textField}
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Company/Organization"
                fullWidth
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
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
                label="Image"
                error={!!errors.image}
                helperText={errors.image?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="talks"
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                scope="speaker-talks"
                fetchOptions={fetchTalkOptions}
                multiple
                label="Talks"
                placeholder="Search talks..."
                error={errors.talks}
                helperText={errors.talks?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <LocaleInput
                {...field}
                type={localeInputTypes.textFieldMultiple}
                label="Biography"
                minRows={4}
                error={!!errors.bio}
                helperText={errors.bio?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Featured Speaker"
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
                label="Active"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicInfoTab;
