import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function SignInPage() {
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'admin@tedxdamascus.com',
      password: 'password',
    },
  });

  const onSubmit = async (data) => {
    await signIn(data.email, data.password);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          {/* Logo */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            {/* <img
              src="/images/tedx-logo.jpg"
              alt="TEDx Damascus"
              style={{
                maxWidth: '200px',
                height: 'auto',
                marginBottom: '16px'
              }}
            /> */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mt: 2,
              }}
            >
              Dashboard Login
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mt: 1,
              }}
            >
              Sign in to manage your TEDx Damascus content
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#EB0028',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#EB0028',
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#EB0028',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#EB0028',
                      },
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#EB0028',
                  '&:hover': { backgroundColor: '#C00020' },
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  mt: 2,
                }}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '0.875rem' }}>
              Demo: admin@tedxdamascus.com / password
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'block' },
          backgroundImage: 'url(/images/login-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(235, 0, 40, 0.1)',
          },
        }}
      />
    </Box>
  );
}

export default SignInPage;
