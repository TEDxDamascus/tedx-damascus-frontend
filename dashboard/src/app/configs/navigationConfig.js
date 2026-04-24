import { Dashboard, People, Event, Settings, Article } from '@mui/icons-material';
import { RecordVoiceOver } from '@mui/icons-material';

import {
  Article,
  Dashboard,
  Event,
  Forum,
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
    id: 'partners',
    title: 'Partners',
    type: 'item',
    icon: Handshake,
    url: '/partners',
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
    id: 'wall',
    title: 'Wall',
    type: 'item',
    icon: Forum,
    url: '/wall',
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
