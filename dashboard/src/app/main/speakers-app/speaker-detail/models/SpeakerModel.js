import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const SpeakerModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('speaker-'),
    name: defaultLocaleValue(),
    bio: defaultLocaleValue(),
    title: defaultLocaleValue(),
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
