import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Edit, Visibility, DeleteOutline } from '@mui/icons-material';
import { useDeleteTeamMemberMutation } from '../teamApi';
import CustomTable from '../../../shared-components/custom-table';
import ConfirmModal from '../../../shared-components/confirm-modal';
import StatusBadge from '../../../shared-components/status-badge';

const TABLE_ID = 'team_members';

const COLUMNS = [
  {
    id: 'photo',
    header: '',
    renderCell: (value, row) => {
      const nameText = typeof row.name === 'string' ? row.name : row.name?.en || row.name?.ar || '';
      return (
        <div className="flex items-center">
          {value ? (
            <img src={value} alt={nameText} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tedx-red text-sm font-semibold text-white">
              {nameText.charAt(0) || '?'}
            </div>
          )}
        </div>
      );
    },
    headerClassName: 'w-16',
  },
  {
    id: 'name',
    header: 'Name',
    sortable: true,
    renderCell: (value) => (
      <span className="font-medium text-tedx-dark">
        {typeof value === 'string' ? value : value?.en || value?.ar || '—'}
      </span>
    ),
  },
  { id: 'department', header: 'Department', sortable: true },
  {
    id: 'role',
    header: 'Role',
    renderCell: (value) => (
      <span>{typeof value === 'string' ? value : value?.en || value?.ar || '—'}</span>
    ),
  },
  {
    id: 'linkedin',
    header: 'Social',
    renderCell: (value) =>
      value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          LinkedIn
        </a>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    id: 'active',
    header: 'Status',
    renderCell: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />,
  },
];

function TeamListTable({ data, totalCount, isLoading }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();
  const [confirmItem, setConfirmItem] = useState(null);

  const handleDeleteConfirm = async () => {
    try {
      await deleteMember(confirmItem.id).unwrap();
      enqueueSnackbar('Member deleted successfully', { variant: 'success' });
      setConfirmItem(null);
    } catch {
      enqueueSnackbar('Failed to delete member', { variant: 'error' });
    }
  };

  const rowActions = (row) => [
    {
      icon: <Visibility style={{ fontSize: 18 }} />,
      label: 'View',
      onClick: () => navigate(`/team/${row.id}`),
    },
    {
      icon: <Edit style={{ fontSize: 18 }} />,
      label: 'Edit',
      onClick: () => navigate(`/team/${row.id}`),
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
        emptyMessage="No team members found."
      />

      <ConfirmModal
        open={!!confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Team Member"
        description={`Are you sure you want to delete "${confirmItem?.name?.en || confirmItem?.name?.ar || 'this member'}"?`}
      />
    </>
  );
}

export default TeamListTable;
