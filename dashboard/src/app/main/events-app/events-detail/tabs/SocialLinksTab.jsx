import { Controller } from 'react-hook-form';
import { TextField, Grid, Box } from '@mui/material';

function LinksTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="ticketsLink"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tickets Booking Link"
                fullWidth
                placeholder="https://ihjoz.com/events/..."
                error={!!errors.ticketsLink}
                helperText={errors.ticketsLink?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="streamingLink"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Live Stream Link (YouTube/Zoom)"
                fullWidth
                placeholder="https://youtube.com/live/..."
                error={!!errors.streamingLink}
                helperText={errors.streamingLink?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="facebookEvent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facebook Event Page"
                fullWidth
                placeholder="https://facebook.com/events/..."
                error={!!errors.facebookEvent}
                helperText={errors.facebookEvent?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Official Event Website"
                fullWidth
                placeholder="https://tedxdamascus.com/events/..."
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LinksTab;