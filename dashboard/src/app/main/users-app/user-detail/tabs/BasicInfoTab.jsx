import { Controller } from 'react-hook-form';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid, Box } from '@mui/material';

const ROLES = [
  { value: 'SuperAdmin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

function BasicInfoTab({ control, errors, isDisabled }) {
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
                label="Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isDisabled}
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
                disabled={isDisabled}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.role} disabled={isDisabled}>
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role">
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicInfoTab;
