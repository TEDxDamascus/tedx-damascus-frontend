import _ from 'lodash';

const SpeakerModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('speaker-'),
    name: '',
    bio: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    image: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      website: ''
    },
    talks: [],
    featured: false,
    active: true,
    createdAt: new Date().toISOString()
  });

export default SpeakerModel;
