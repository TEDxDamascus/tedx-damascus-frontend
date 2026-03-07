import { useGetSpeakersQuery } from '../SpeakersApi';
import { useTableState } from '../../../shared-components/custom-table';
import SpeakersListHeader from './SpeakersListHeader';
import SpeakersListTable from './SpeakersListTable';

const TABLE_ID = 'speakers';

function SpeakersList() {
  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetSpeakersQuery(params);

  return (
    <div className="p-6">
      <SpeakersListHeader />
      <SpeakersListTable
        data={data?.data?.items ?? data?.data ?? []}
        totalCount={data?.data?.total ?? data?.total ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}

export default SpeakersList;
