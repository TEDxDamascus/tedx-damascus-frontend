import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import store from './store/store';
import themeConfig from './configs/themeConfig';
import AuthGuard from './auth/AuthGuard';
import { AuthProvider } from './auth/AuthContext';
import IntlProviderWrapper from './providers/IntlProviderWrapper';
import MainLayout from './theme-layouts/MainLayout/MainLayout';
import AuthLayout from './theme-layouts/AuthLayout/AuthLayout';
import SignInConfig from './main/sign-in/SignInConfig';
import DashboardAppConfig from './main/dashboard/DashboardAppConfig';
import SpeakersAppConfig from './main/speakers-app/SpeakersAppConfig';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeConfig}>
        <CssBaseline />
        <IntlProviderWrapper>
          <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route element={<AuthLayout />}>
                  {SignInConfig.routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Route>

                {/* Protected routes */}
                <Route
                  element={
                    <AuthGuard>
                      <MainLayout />
                    </AuthGuard>
                  }
                >
                  {DashboardAppConfig.routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element}>
                      {route.children?.map((child, childIndex) => (
                        <Route key={childIndex} path={child.path} element={child.element} />
                      ))}
                    </Route>
                  ))}
                  {SpeakersAppConfig.routes.map((route, index) => (
                    <Route key={`speaker-${index}`} path={route.path} element={route.element}>
                      {route.children?.map((child, childIndex) => (
                        <Route key={childIndex} path={child.path} element={child.element} />
                      ))}
                    </Route>
                  ))}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </SnackbarProvider>
        </IntlProviderWrapper>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
