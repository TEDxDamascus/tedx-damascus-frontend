import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
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
import FormsAppConfig from './main/forms-app/FormsAppConfig';
import BlogsAppConfig from './main/blog-app/BlogsAppConfig';
import WallAppConfig from './main/wall-app/WallAppConfig';
import EventsAppConfig from './main/events-app/EventsAppConfig.jsx';
import PartnersAppConfig from './main/partners-app/PartnersAppConfig';

import NotFoundPage from './main/not-found/NotFoundPage';
import UsersAppConfig from './main/users-app/UsersAppConfig';

function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeConfig}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <IntlProviderWrapper>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
                      {FormsAppConfig.routes.map((route, index) => (
                        <Route key={`forms-${index}`} path={route.path} element={route.element}>
                          {route.children?.map((child, childIndex) => (
                            <Route key={childIndex} path={child.path} element={child.element} />
                          ))}
                        </Route>
                      ))}{' '}
                      {UsersAppConfig.routes.map((route, index) => (
                        <Route key={`forms-${index}`} path={route.path} element={route.element}>
                          {route.children?.map((child, childIndex) => (
                            <Route key={childIndex} path={child.path} element={child.element} />
                          ))}
                        </Route>
                      ))}
                      {EventsAppConfig.routes.map((route, index) => (
                        <Route key={`events-${index}`} path={route.path} element={route.element}>
                          {route.children?.map((child, childIndex) => (
                            <Route key={childIndex} path={child.path} element={child.element} />
                          ))}
                        </Route>
                      ))}
                      {BlogsAppConfig.routes.map((route, index) => (
                        <Route key={`blogs-${index}`} path={route.path} element={route.element}>
                          {route.children?.map((child, childIndex) => (
                            <Route key={childIndex} path={child.path} element={child.element} />
                          ))}
                        </Route>
                      ))}
                      {WallAppConfig.routes.map((route, index) => (
                        <Route key={`wall-${index}`} path={route.path} element={route.element}>
                          {route.children?.map((child, childIndex) => (
                            <Route key={childIndex} path={child.path} element={child.element} />
                          ))}
                        </Route>
                      ))}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
                        {PartnersAppConfig.routes.map((route, index) => (
                          <Route
                            key={`partners-${index}`}
                            path={route.path}
                            element={route.element}
                          >
                            {route.children?.map((child, childIndex) => (
                              <Route key={childIndex} path={child.path} element={child.element} />
                            ))}
                          </Route>
                        ))}
                        {FormsAppConfig.routes.map((route, index) => (
                          <Route key={`forms-${index}`} path={route.path} element={route.element}>
                            {route.children?.map((child, childIndex) => (
                              <Route key={childIndex} path={child.path} element={child.element} />
                            ))}
                          </Route>
                        ))}{' '}
                        {UsersAppConfig.routes.map((route, index) => (
                          <Route key={`forms-${index}`} path={route.path} element={route.element}>
                            {route.children?.map((child, childIndex) => (
                              <Route key={childIndex} path={child.path} element={child.element} />
                            ))}
                          </Route>
                        ))}
                        {EventsAppConfig.routes.map((route, index) => (
                          <Route key={`events-${index}`} path={route.path} element={route.element}>
                            {route.children?.map((child, childIndex) => (
                              <Route key={childIndex} path={child.path} element={child.element} />
                            ))}
                          </Route>
                        ))}
                        {BlogsAppConfig.routes.map((route, index) => (
                          <Route key={`blogs-${index}`} path={route.path} element={route.element}>
                            {route.children?.map((child, childIndex) => (
                              <Route key={childIndex} path={child.path} element={child.element} />
                            ))}
                          </Route>
                        ))}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Route>

                      {/* 404 — catch-all */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </AuthProvider>
                </BrowserRouter>
              </SnackbarProvider>
            </IntlProviderWrapper>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export default App;
