import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

// No backend Event entity provided yet — schema is frontend-proposed.
// Ask backend team to create an Event entity (see gap report).
const EventModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('event-'),
    title: defaultLocaleValue(),
    description: defaultLocaleValue(),
    brief: defaultLocaleValue(),
    location: defaultLocaleValue(),
    date: '',
    time: '',
    starts_at: '',
    ends_at: '',
    status: 'upcoming',
    image: '',
    gallery: [],
    speakers: [],
    max_attendees: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

export default EventModel;
