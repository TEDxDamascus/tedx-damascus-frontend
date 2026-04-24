import { Controller } from 'react-hook-form';
import { TextField, Grid, Box } from '@mui/material';

function SocialLinksTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="socialLinks.website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Company Website"
                fullWidth
                placeholder="https://example.com"
                error={!!errors.socialLinks?.website}
                helperText={errors.socialLinks?.website?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="socialLinks.instagram"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Instagram Profile"
                fullWidth
                placeholder="https://instagram.com/username"
                error={!!errors.socialLinks?.instagram}
                helperText={errors.socialLinks?.instagram?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="socialLinks.linkedin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="LinkedIn Company Page"
                fullWidth
                placeholder="https://linkedin.com/company/username"
                error={!!errors.socialLinks?.linkedin}
                helperText={errors.socialLinks?.linkedin?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="socialLinks.facebook"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facebook Page"
                fullWidth
                placeholder="https://facebook.com/username"
                error={!!errors.socialLinks?.facebook}
                helperText={errors.socialLinks?.facebook?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SocialLinksTab;