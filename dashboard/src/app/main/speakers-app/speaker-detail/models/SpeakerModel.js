import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const SpeakerModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('speaker-'),
    name: defaultLocaleValue(),
    bio: defaultLocaleValue(),
    description: defaultLocaleValue(),
    speaker_image: '',
    social_links: [],
    gallery: [],
    video_link: '',
    company: '',
    email: '',
    phone: '',
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

export default SpeakerModel;
