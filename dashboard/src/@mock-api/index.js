import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';
import _ from 'lodash';

const mock = new MockAdapter(Axios, { delayResponse: 300 });


let speakersDB = [
  {
    id: '1',
    name: 'Dr. Ahmad Al-Hassan',
    bio: 'Pioneering AI researcher and entrepreneur focused on democratizing artificial intelligence across the Middle East.',
    title: 'AI Research Director',
    company: 'Damascus Tech Innovation Hub',
    email: 'ahmad.hassan@example.com',
    phone: '+963 11 2234567',
    image: '/images/speakers/speaker1.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ahmadhassan',
      twitter: 'https://twitter.com/ahmadhassan',
      facebook: '',
      website: 'https://ahmadhassan.tech'
    },
    talks: ['The Future of AI in Syria', 'Building Tech Communities'],
    featured: true,
    active: true,
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Layla Mansour',
    bio: 'Social entrepreneur and founder of multiple education initiatives empowering Syrian youth through technology.',
    title: 'Founder & CEO',
    company: 'EdTech Syria',
    email: 'layla.mansour@example.com',
    phone: '+963 11 3345678',
    image: '/images/speakers/speaker2.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/laylam',
      twitter: '',
      facebook: 'https://facebook.com/laylam',
      website: 'https://edtechsyria.org'
    },
    talks: ['Education Revolution in Crisis', 'Empowering Through Technology'],
    featured: true,
    active: true,
    createdAt: '2025-01-16T11:30:00Z'
  },
  {
    id: '3',
    name: 'Omar Khalil',
    bio: 'Award-winning architect reimagining urban spaces with sustainable and culturally-rooted designs.',
    title: 'Principal Architect',
    company: 'Heritage Architecture Studio',
    email: 'omar.khalil@example.com',
    phone: '+963 11 4456789',
    image: '/images/speakers/speaker3.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/omarkhalil',
      twitter: 'https://twitter.com/omarkhalil',
      facebook: '',
      website: 'https://heritagearchitecture.com'
    },
    talks: ['Rebuilding Identity Through Design'],
    featured: false,
    active: true,
    createdAt: '2025-01-17T09:15:00Z'
  },
  {
    id: '4',
    name: 'Sarah Jaber',
    bio: 'Neuroscientist exploring the intersection of brain science, mental health, and cultural well-being.',
    title: 'Research Scientist',
    company: 'Damascus University',
    email: 'sarah.jaber@example.com',
    phone: '+963 11 5567890',
    image: '/images/speakers/speaker4.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjaber',
      twitter: 'https://twitter.com/drsarahjaber',
      facebook: '',
      website: ''
    },
    talks: ['Understanding the Resilient Mind', 'Mental Health in Communities'],
    featured: true,
    active: true,
    createdAt: '2025-01-18T14:20:00Z'
  },
  {
    id: '5',
    name: 'Karim Othman',
    bio: 'Documentary filmmaker and storyteller capturing untold narratives from across Syria and the region.',
    title: 'Director',
    company: 'Syrian Stories Productions',
    email: 'karim.othman@example.com',
    phone: '+963 11 6678901',
    image: '/images/speakers/speaker5.jpg',
    socialLinks: {
      linkedin: '',
      twitter: 'https://twitter.com/karimothman',
      facebook: 'https://facebook.com/karimothmanfilms',
      website: 'https://syrianstories.com'
    },
    talks: ['The Power of Storytelling'],
    featured: false,
    active: true,
    createdAt: '2025-01-19T16:45:00Z'
  }
];

// GET /api/speakers
mock.onGet(/\/api\/speakers(\?.*)?/).reply((config) => {
  const urlParams = new URLSearchParams(config.url.split('?')[1]);
  const page = parseInt(urlParams.get('page') || '1');
  const pageSize = parseInt(urlParams.get('pageSize') || '10');
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return [200, {
    data: speakersDB.slice(start, end),
    total: speakersDB.length,
    page,
    pageSize
  }];
});

// GET /api/speakers/:id
mock.onGet(/\/api\/speakers\/[^/?]+$/).reply((config) => {
  const id = config.url.split('/').pop();
  const speaker = speakersDB.find(s => s.id === id);

  if (speaker) {
    return [200, speaker];
  }
  return [404, { message: 'Speaker not found' }];
});

// POST /api/speakers
mock.onPost('/api/speakers').reply((config) => {
  const newSpeaker = {
    ...JSON.parse(config.data),
    id: _.uniqueId('speaker-'),
    createdAt: new Date().toISOString()
  };
  speakersDB.push(newSpeaker);
  return [201, newSpeaker];
});

// PATCH /api/speakers/:id
mock.onPatch(/\/api\/speakers\/[^/?]+$/).reply((config) => {
  const id = config.url.split('/').pop();
  const index = speakersDB.findIndex(s => s.id === id);

  if (index !== -1) {
    speakersDB[index] = {
      ...speakersDB[index],
      ...JSON.parse(config.data)
    };
    return [200, speakersDB[index]];
  }
  return [404, { message: 'Speaker not found' }];
});

// DELETE /api/speakers/:id
mock.onDelete(/\/api\/speakers\/[^/?]+$/).reply((config) => {
  const id = config.url.split('/').pop();
  const index = speakersDB.findIndex(s => s.id === id);

  if (index !== -1) {
    speakersDB.splice(index, 1);
    return [200, { message: 'Speaker deleted' }];
  }
  return [404, { message: 'Speaker not found' }];
});

export default mock;
