import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';
const EventModel = () => ({
  title: '',
  description: '',
  brief: '',
  location: '',
  date: '',
  time: '',
  image: '',
  gallery: [],
  speakers: [],
  status: 'draft',
  active: false,
});


export default EventModel;
