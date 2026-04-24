import { Controller } from 'react-hook-form';
import { TextField, FormControlLabel, Switch, Grid, Box } from '@mui/material';
import { LocaleInput, localeInputTypes } from '../../../../shared-components/locale-input';

function BasicInfoTab({ control, errors }) {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <LocaleInput {...field} type={localeInputTypes.textField} label="Full Name" required error={!!errors.name} helperText={errors.name?.message} />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <LocaleInput {...field} type={localeInputTypes.textField} label="Role" required error={!!errors.role} helperText={errors.role?.message} />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Department" fullWidth error={!!errors.department} helperText={errors.department?.message} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <LocaleInput {...field} type={localeInputTypes.textFieldMultiple} label="Bio" minRows={3} error={!!errors.bio} helperText={errors.bio?.message} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={!!field.value} />} label="Active" />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicInfoTab;