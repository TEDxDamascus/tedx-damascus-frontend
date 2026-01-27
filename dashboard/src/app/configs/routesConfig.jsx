import { Navigate } from 'react-router-dom';
import SpeakersAppConfig from '../main/speakers-app/SpeakersAppConfig';
import DashboardAppConfig from '../main/dashboard/DashboardAppConfig';
import SignInConfig from '../main/sign-in/SignInConfig';

const routeConfigs = [
  SignInConfig,
  DashboardAppConfig,
  SpeakersAppConfig
];

const routes = [
  ...routeConfigs.flatMap(config => config.routes),
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  }
];

export default routes;
