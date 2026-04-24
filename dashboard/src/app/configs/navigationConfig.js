import {
  Article,
  Dashboard,
  Event,
  LabelOutlined,
  People,
  RecordVoiceOver,
  Settings,
} from '@mui/icons-material';

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
    icon: RecordVoiceOver,
    url: '/speakers',
  },
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    icon: People,
    url: '/users',
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
    id: 'blog-categories',
    title: 'Blog categories',
    type: 'item',
    icon: LabelOutlined,
    url: '/blogs/categories',
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
