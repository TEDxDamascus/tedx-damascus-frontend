import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useGetSpeakersQuery } from '../SpeakersApi';
import SpeakersListHeader from './SpeakersListHeader';
import SpeakersListTable from './SpeakersListTable';
import { filterIcon as FilterIcon } from '@/app/shared-components/FilterIcon';

function SpeakersList() {
  const { data, isLoading } = useGetSpeakersQuery({ page: 1, pageSize: 100 });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data?.data]);

  const filterConfig = useMemo(() => [
    { key: 'name', label: 'Name', type: 'text' },
    { 
      key: 'createdAt',
      label: 'Year', 
      type: 'date', 
      options: ['2023', '2024', '2025', '2026'] 
    },
  ], []);

  return (
    <div className="w-full h-full p-6">
      <SpeakersListHeader />
      
      <Box sx={{ mb: 3 }}>
     
        <FilterIcon 
          items={data?.data || []} 
          filters={filterConfig} 
          onFiltered={setFilteredData} 
        />
      </Box>

      
      <SpeakersListTable speakers={filteredData} isLoading={isLoading} />
    </div>
  );
}

export default SpeakersList;