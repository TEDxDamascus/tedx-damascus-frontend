import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { useGetUsersQuery } from '../UsersApi';
import { useTableState } from '../../../shared-components/custom-table';
import UsersListHeader from './UsersListHeader';
import UsersListTable from './UsersListTable';
import FilterIcon from '@/app/shared-components/filter-icon/FilterIcon';

const TABLE_ID = 'users';

function UsersList() {
  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetUsersQuery(params);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const usersArray = data?.data ?? [];
    setFilteredData(usersArray);
  }, [data]);

  const filterConfig = useMemo(
    () => [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Disabled', value: 'disabled' },
        ],
      },
    ],
    [],
  );

  const handleSelectChange = (id, checked) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const handleBulkAction = () => {
    setSelectedIds([]);
  };

  return (
    <div className="p-6 pt-8">
      <UsersListHeader />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FilterIcon
          items={data?.data ?? []}
          filters={filterConfig}
          onFiltered={setFilteredData}
        />
      </Box>

      <UsersListTable
        data={filteredData}
        totalCount={data?.data?.total ?? 0}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectChange={handleSelectChange}
        onBulkAction={handleBulkAction}
      />
    </div>
  );
}

export default UsersList;
