import { lazy } from 'react';

const EventsList = lazy(() => import('./events-list/EventsList'));

const EventsAppConfig = {
  routes: [
    {
      path: '/events',
      children: [
        {
          path: '',
          element: <EventsList />,
        },
      ],
    },
  ],
};

export default EventsAppConfig;
