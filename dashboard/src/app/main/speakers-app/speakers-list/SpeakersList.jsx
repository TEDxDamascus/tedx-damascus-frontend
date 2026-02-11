import { useGetSpeakersQuery } from '../SpeakersApi';
import SpeakersListHeader from './SpeakersListHeader';
import SpeakersListTable from './SpeakersListTable';

function SpeakersList() {
  const { data, isLoading } = useGetSpeakersQuery({ page: 1, pageSize: 100 });

  return (
    <div className="w-full h-full p-6">
      <SpeakersListHeader />
      <SpeakersListTable speakers={data?.data || []} isLoading={isLoading} />
    </div>
  );
}

export default SpeakersList;
