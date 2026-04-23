import { Controller } from 'react-hook-form';
import { TextField, Grid, Box } from '@mui/material';

function SocialLinksTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="linkedin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="LinkedIn Profile"
                fullWidth
                placeholder="https://linkedin.com/in/username"
                error={!!errors.linkedin}
                helperText={errors.linkedin?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="facebook"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facebook Profile"
                fullWidth
                placeholder="https://facebook.com/username"
                error={!!errors.facebook}
                helperText={errors.facebook?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="instagram"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Instagram Profile"
                fullWidth
                placeholder="https://instagram.com/username"
                error={!!errors.instagram}
                helperText={errors.instagram?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="portfolio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Portfolio / Personal Website"
                fullWidth
                placeholder="https://yourname.com"
                error={!!errors.portfolio}
                helperText={errors.portfolio?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SocialLinksTab;