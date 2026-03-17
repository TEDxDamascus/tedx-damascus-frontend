import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useGetSpeakersQuery } from '../SpeakersApi';
import { useTableState } from '../../../shared-components/custom-table';
import SpeakersListHeader from './SpeakersListHeader';
import SpeakersListTable from './SpeakersListTable';
import FilterIcon from '@/app/shared-components/filter-icon/FilterIcon';

const TABLE_ID = 'speakers';

function SpeakersList() {
  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetSpeakersQuery(params);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const speakersArray = data?.data?.items ?? data?.data ?? [];
    setFilteredData(speakersArray);
  }, [data]);

  const filterConfig = useMemo(
    () => [
      { key: 'name', label: 'Name', type: 'text' },
      {
        key: 'createdAt',
        label: 'Year',
        type: 'date',
        options: ['2023', '2024', '2025', '2026'],
      },
    ],
    [],
  );

  return (
    <div className="p-6 pt-8">
      <SpeakersListHeader />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FilterIcon
          items={data?.data?.items ?? data?.data ?? []}
          filters={filterConfig}
          onFiltered={setFilteredData}
        />
      </Box>

      <SpeakersListTable
        data={filteredData}
        totalCount={data?.data?.total ?? data?.total ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}

export default SpeakersList;
