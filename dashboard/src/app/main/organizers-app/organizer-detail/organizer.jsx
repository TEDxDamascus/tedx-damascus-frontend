// Organizer.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, Tab, Box, Paper, CircularProgress, Button } from '@mui/material';
import { Save } from '@mui/icons-material';
import Breadcrumb from '../../../shared-components/breadcrumb';
import { useSnackbar } from 'notistack';

import {
  useGetOrganizerQuery,
  useCreateOrganizerMutation,
  useUpdateOrganizerMutation,
} from '../organizersApi';

import BasicInfoTab from './tabs/BasicInfoTab';
import MediaLinksTab from './tabs/SocialLinksTab';

import OrganizerModel from './models/organizerModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';

const localeObjectSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

const organizerSchema = z.object({
  name: localeObjectSchema.refine(
    (v) => v?.en?.trim() || v?.ar?.trim(),
    'Name is required'
  ),
  bio: localeObjectSchema.optional(),
  image: z.string().optional(),
  social_links: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  role: z.string().optional(),
});

function Organizer() {
 const { organizerId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState(0);

const isNew = organizerId === 'add';

  const { data: organizer, isLoading } = useGetOrganizerQuery(organizerId, {
    skip: isNew,
  });

  const [createOrganizer, { isLoading: isCreating }] =
    useCreateOrganizerMutation();

  const [updateOrganizer, { isLoading: isUpdating }] =
    useUpdateOrganizerMutation();

  const isSaving = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(organizerSchema),
    defaultValues: OrganizerModel(),
  });

  useEffect(() => {
    if (organizer && !isNew) {
      reset({
        ...organizer,
        name: ensureLocaleValue(organizer.name),
        bio: ensureLocaleValue(organizer.bio),
        image: organizer.image || '',
        social_links: Array.isArray(organizer.social_links)
          ? organizer.social_links
          : [],
        gallery: Array.isArray(organizer.gallery)
          ? organizer.gallery
          : [],
        role: organizer.role || '',
      });
    }
  }, [organizer, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      if (isNew) {
        await createOrganizer(data).unwrap();

        enqueueSnackbar('Organizer created successfully', {
          variant: 'success',
        });
      } else {
        await updateOrganizer({
          id: organizerId,
          data,
        }).unwrap();

        enqueueSnackbar('Organizer updated successfully', {
          variant: 'success',
        });
      }

      navigate('/organizers');
    } catch {
      enqueueSnackbar(
        `Failed to ${isNew ? 'create' : 'update'} organizer`,
        {
          variant: 'error',
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress className="text-tedx-red" />
      </div>
    );
  }

  return (
    <div className="p-6 pt-8">
      <Breadcrumb
        items={[
          { label: 'Organizers', href: '/organizers' },
          { label: isNew ? 'Add New Organizer' : 'Edit Organizer' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tedx-dark">
          {isNew ? 'Add New Organizer' : 'Edit Organizer'}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => navigate('/organizers')}
            className="border-gray-300 text-gray-500"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              isSaving ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <Save />
              )
            }
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            sx={{
              bgcolor: 'var(--color-primary)',
              '&:hover': {
                bgcolor: 'var(--color-primary-dark)',
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Organizer'}
          </Button>
        </div>
      </div>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, v) => setCurrentTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--color-primary)',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)',
            },
          }}
        >
          <Tab label="Basic Information" />
          <Tab label="Media & Links" />
        </Tabs>

        <Box>
          {currentTab === 0 && (
            <BasicInfoTab control={control} errors={errors} />
          )}

          {currentTab === 1 && (
            <MediaLinksTab control={control} errors={errors} />
          )}
        </Box>
      </Paper>
    </div>
  );
}

export default Organizer;