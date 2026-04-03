import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const EventModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('event-'),
    title: defaultLocaleValue(),
    description: defaultLocaleValue(),
    location: defaultLocaleValue(),
    date: '',
    time: '',
    image: '',
    venue: '',
    status: 'upcoming',
    speakers: [],
    ticketsLink: '',
    active: true,
    createdAt: new Date().toISOString(),
  });

export default EventModel;