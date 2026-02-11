import { Controller } from 'react-hook-form';
import {
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Box
} from '@mui/material';

function BasicInfoTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
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
              <TextField
                {...field}
                label="Title"
                fullWidth
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

        <Grid item xs={12} md={6}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image URL"
                fullWidth
                error={!!errors.image}
                helperText={errors.image?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Biography"
                fullWidth
                multiline
                rows={4}
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
