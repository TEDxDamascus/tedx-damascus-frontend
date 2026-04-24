import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const PartnerModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('partner-'),
    title: defaultLocaleValue(),
    description: defaultLocaleValue(),
    image: '',
    email: '',
    phone: '',
    type: '',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

export default PartnerModel;