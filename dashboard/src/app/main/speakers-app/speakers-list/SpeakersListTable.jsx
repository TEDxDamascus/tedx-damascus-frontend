import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Chip, Avatar, Box } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useDeleteSpeakerMutation } from '../SpeakersApi';
import { useSnackbar } from 'notistack';
import ConfirmModal from '../../../shared-components/ConfirmModal';

function SpeakersListTable({ speakers = [], isLoading }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteSpeaker] = useDeleteSpeakerMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (speakerId) => {
    setSelectedSpeakerId(speakerId);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedSpeakerId) return;

    try {
      setIsDeleting(true);
      await deleteSpeaker(selectedSpeakerId).unwrap();

      enqueueSnackbar('Speaker deleted successfully', {
        variant: 'success',
      });

      setOpenDeleteModal(false);
      setSelectedSpeakerId(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete speaker', {
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: '',
        size: 80,
        Cell: ({ row }) => (
          <Avatar
            src={row.original.image}
            alt={row.original.name}
            sx={{ width: 48, height: 48 }}
          >
            {row.original.name.charAt(0)}
          </Avatar>
        )
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 180,
      },
      {
        accessorKey: 'company',
        header: 'Company',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 220,
      },
      {
        accessorKey: 'featured',
        header: 'Featured',
        size: 120,
        Cell: ({ row }) => (
          <Chip
            label={row.original.featured ? 'Yes' : 'No'}
            color={row.original.featured ? 'primary' : 'default'}
            size="small"
            sx={{
                           backgroundColor: row.original.featured ? '#EB0028' : undefined,
            }}
          />
        )
      },
      {
        accessorKey: 'active',
        header: 'Status',
        size: 120,
        Cell: ({ row }) => (
          <Chip
            label={row.original.active ? 'Active' : 'Inactive'}
            color={row.original.active ? 'success' : 'default'}
            size="small"
          />
        )
      }
    ],
    []
  );

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={speakers}
        enableRowActions
        positionActionsColumn="last"
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Actions',
            size: 150,
          },
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => navigate(`/speakers/${row.original.id}`)}
              color="primary"
              size="small"
            >
              <Visibility />
            </IconButton>
            <IconButton
              onClick={() => navigate(`/speakers/${row.original.id}`)}
              color="info"
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteClick(row.original.id)}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
          </Box>
        )}
        state={{ isLoading }}
        enableColumnFilters
        enableGlobalFilter
        enableSorting
        enablePagination
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #e0e0e0',
            borderRadius: 2,
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
          },
        }}
      />

      {/*  Confirm Delete Modal */}
      <ConfirmModal
        open={openDeleteModal}
        onClose={() => {
          if (!isDeleting) {
            setOpenDeleteModal(false);
            setSelectedSpeakerId(null);
          }
        }}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Speaker"
        description="Are you sure you want to delete this speaker? This action cannot be undone."
      />
    </div>
  );
}

export default SpeakersListTable;
