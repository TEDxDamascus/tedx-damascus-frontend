import { Navigate } from 'react-router-dom';
import SpeakersAppConfig from '../main/speakers-app/SpeakersAppConfig';
import DashboardAppConfig from '../main/dashboard/DashboardAppConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import EventsAppConfig from '../main/events-app/EventsAppConfig';
import UsersAppConfig from '../main/users-app/UsersAppConfig';
import PartnersAppConfig from '../main/partners-app/PartnersAppConfig';

const routeConfigs = [
  SignInConfig,
  DashboardAppConfig,
  SpeakersAppConfig,
  EventsAppConfig,
  UsersAppConfig,
  PartnersAppConfig,
];

const routes = [
  ...routeConfigs.flatMap((config) => config.routes),
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
