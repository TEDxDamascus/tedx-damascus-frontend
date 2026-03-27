import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useTableState } from '../../../shared-components/custom-table';
import EventsListHeader from './EventsListHeader';
import EventsListTable from './EventsListTable';
import FilterIcon from '@/app/shared-components/filter-icon/FilterIcon';
import { useGetEventsQuery } from '@/app/main/events-app/EventsApi.js';

const TABLE_ID = 'events';

function EventsList() {
  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetEventsQuery(params);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const eventsArray = data?.data?.items ?? data?.data ?? [];
    setFilteredData(eventsArray);
  }, [data]);

  const filterConfig = useMemo(() => [{ key: 'title', label: 'Event Title', type: 'text' }], []);

  return (
    <div className="p-6 pt-8">
      <EventsListHeader />
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FilterIcon
          items={data?.data?.items ?? data?.data ?? []}
          filters={filterConfig}
          onFiltered={setFilteredData}
        />
      </Box>
      <EventsListTable
        data={filteredData}
        totalCount={data?.data?.total ?? data?.total ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EventsList;
