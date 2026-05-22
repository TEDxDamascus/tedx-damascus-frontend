// OrganizerModel.js

import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const OrganizerModel = (data) =>
  _.defaults(data || {}, {
    _id: _.uniqueId('organizer-'),
    name: defaultLocaleValue(),
    bio: defaultLocaleValue(),
    image: '',
    social_links: [],
    gallery: [],
    role: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

export default OrganizerModel;
