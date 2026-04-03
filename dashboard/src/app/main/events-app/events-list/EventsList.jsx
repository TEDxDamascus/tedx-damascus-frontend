import { useState, useEffect } from 'react';
import { useTableState } from '../../../shared-components/custom-table';
import EventsListHeader from './EventsListHeader';
import EventsListTable from './EventsListTable';
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

  return (
    <div className="p-6 pt-8">
      <EventsListHeader />
      <EventsListTable
        data={filteredData}
        totalCount={data?.data?.total ?? data?.total ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EventsList;
