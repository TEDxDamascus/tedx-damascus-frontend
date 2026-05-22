import { Controller } from 'react-hook-form';
import { TextField, Grid, Box } from '@mui/material';

function SocialLinksTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="social_links"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Social Links"
                placeholder="https://linkedin.com/... , https://facebook.com/..."
                value={field.value?.join(', ') || ''}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
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
                placeholder="https://facebook.com/name"
                error={!!errors.socialLinks?.facebook}
                helperText={errors.socialLinks?.facebook?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="socialLinks.twitter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Twitter/X Profile"
                fullWidth
                placeholder="https://twitter.com/name"
                error={!!errors.socialLinks?.twitter}
                helperText={errors.socialLinks?.twitter?.message}
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
                placeholder="https://instagram.com/name"
                error={!!errors.socialLinks?.instagram}
                helperText={errors.socialLinks?.instagram?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SocialLinksTab;
