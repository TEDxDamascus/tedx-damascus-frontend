import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const TeamMemberModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('member-'),
    name: defaultLocaleValue(),
    role: defaultLocaleValue(),
    bio: defaultLocaleValue(),
    department: '',
    photo: '',
    linkedin: '',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

export default TeamMemberModel;
