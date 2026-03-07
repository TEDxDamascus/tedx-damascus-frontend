import { useState } from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import { Image } from '@mui/icons-material';
import ImagePickerDialog from './ImagePickerDialog';

export default function ImagePickerField({
  value,
  onChange,
  label = 'Image',
  error,
  helperText,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {value ? (
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Image sx={{ color: '#ccc', fontSize: 28 }} />
          )}
        </Box>

        <TextField
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          fullWidth
          error={error}
          helperText={helperText}
          disabled={disabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => setOpen(true)}
                  disabled={disabled}
                  sx={{ textTransform: 'none', color: '#EB0028', whiteSpace: 'nowrap' }}
                >
                  Browse
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <ImagePickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={onChange}
        currentUrl={value ?? ''}
      />
    </>
  );
}
