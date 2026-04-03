import { Dashboard, People, Event, Settings, Article } from '@mui/icons-material';

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: Dashboard,
    url: '/dashboard',
  },
  {
    id: 'speakers',
    title: 'Speakers',
    type: 'item',
    icon: People,
    url: '/speakers',
  },
  {
    id: 'events',
    title: 'Events',
    type: 'item',
    icon: Event,
    url: '/events',
  },
  {
    id: 'blog',
    title: 'Blog',
    type: 'item',
    icon: Article,
    url: '/blogs',
  },
  {
    id: 'settings',
    title: 'Settings',
    type: 'item',
    icon: Settings,
    url: '/settings',
  },
];

export default navigationConfig;
