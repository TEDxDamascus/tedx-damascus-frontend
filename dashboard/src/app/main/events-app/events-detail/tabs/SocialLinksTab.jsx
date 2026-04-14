import { useState } from 'react';
import { Controller, useController } from 'react-hook-form';
import { TextField, Grid, Box, Typography, IconButton, Button } from '@mui/material';
import { Add, DeleteOutline } from '@mui/icons-material';
import { ImagePickerDialog } from '../../../../shared-components/image-picker';

function GalleryPicker({ control, name }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { field } = useController({ control, name });
  const images = Array.isArray(field.value) ? field.value : [];

  const handleAdd = (url) => {
    if (url && !images.includes(url)) {
      field.onChange([...images, url]);
    }
    setDialogOpen(false);
  };

  const handleRemove = (url) => {
    field.onChange(images.filter((u) => u !== url));
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
        Gallery
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
        {images.map((url, i) => (
          <Box
            key={i}
            sx={{
              position: 'relative',
              width: 120,
              height: 90,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
            }}
          >
            <img src={url} alt={`gallery-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <IconButton
              size="small"
              onClick={() => handleRemove(url)}
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                bgcolor: 'rgba(0,0,0,0.55)',
                color: 'white',
                p: 0.4,
                '&:hover': { bgcolor: 'rgba(235,0,40,0.85)' },
              }}
            >
              <DeleteOutline sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{
            height: 90,
            width: 120,
            border: '1px dashed #bdbdbd',
            color: 'text.secondary',
            flexDirection: 'column',
            gap: 0.5,
            '&:hover': { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' },
          }}
        >
          Add
        </Button>
      </Box>
      <ImagePickerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleAdd}
        currentUrl=""
      />
    </Box>
  );
}

function LinksTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GalleryPicker control={control} name="gallery" />
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
