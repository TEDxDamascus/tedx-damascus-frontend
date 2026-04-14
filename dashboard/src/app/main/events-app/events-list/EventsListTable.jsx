import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Edit, Visibility, DeleteOutline } from '@mui/icons-material';
import { useDeleteEventMutation } from '../EventsApi';
import CustomTable from '../../../shared-components/custom-table';
import ConfirmModal from '../../../shared-components/confirm-modal';
import StatusBadge from '../../../shared-components/status-badge';

const TABLE_ID = 'events';

const COLUMNS = [
  {
    id: 'image',
    header: '',
    renderCell: (value, row) => {
      const titleText = row.title?.en || row.title?.ar || '';
      return (
        <div className="flex items-center">
          {value ? (
            <img src={value} alt={titleText} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tedx-red text-sm font-semibold text-white">
              {titleText.charAt(0) || '?'}
            </div>
          )}
        </div>
      );
    },
    headerClassName: 'w-16',
  },
  {
    id: 'title',
    header: 'Event Title',
    sortable: true,
    renderCell: (value) => (
      <span className="font-medium text-tedx-dark">
        {typeof value === 'string' ? value : value?.en || value?.ar || '—'}
      </span>
    ),
  },
  { id: 'date', header: 'Date', sortable: true },
  {
    id: 'location',
    header: 'Location',
    sortable: true,
    renderCell: (value) =>
      typeof value === 'string' ? value : value?.en || value?.ar || '—',
  },
  {
    id: 'active',
    header: 'Status',
    renderCell: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />,
  },
];

function EventsListTable({ data, totalCount, isLoading }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [confirmItem, setConfirmItem] = useState(null);

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(confirmItem.id).unwrap();
      enqueueSnackbar('Event deleted successfully', { variant: 'success' });
      setConfirmItem(null);
    } catch {
      enqueueSnackbar('Failed to delete event', { variant: 'error' });
    }
  };

  const rowActions = (row) => [
    {
      icon: <Visibility style={{ fontSize: 18 }} />,
      label: 'View',
      onClick: () => navigate(`/events/${row.id}`),
    },
    {
      icon: <Edit style={{ fontSize: 18 }} />,
      label: 'Edit',
      onClick: () => navigate(`/events/${row.id}`),
    },
    {
      icon: <DeleteOutline style={{ fontSize: 18 }} />,
      label: 'Delete',
      danger: true,
      onClick: () => setConfirmItem(row),
    },
  ];

  return (
    <>
      <CustomTable
        tableId={TABLE_ID}
        columns={COLUMNS}
        data={data}
        totalCount={totalCount}
        isLoading={isLoading}
        rowActions={rowActions}
        emptyMessage="No events found. Add your first event!"
      />

      <ConfirmModal
        open={!!confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Event"
        description={`Are you sure you want to delete "${confirmItem?.title?.en || confirmItem?.title?.ar || confirmItem?.title || 'this event'}"? This action cannot be undone.`}
      />
    </>
  );
}

export default EventsListTable;
