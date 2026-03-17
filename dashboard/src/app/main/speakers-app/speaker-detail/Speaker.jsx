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
  useGetSpeakerQuery,
  useCreateSpeakerMutation,
  useUpdateSpeakerMutation,
} from '../SpeakersApi';
import BasicInfoTab from './tabs/BasicInfoTab';
import SocialLinksTab from './tabs/SocialLinksTab';
import SpeakerModel from './models/SpeakerModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';

const localeObjectSchema = z.object({ ar: z.string(), en: z.string() });

const speakerSchema = z.object({
  name: localeObjectSchema.refine((v) => v?.en?.trim() || v?.ar?.trim(), 'Name is required'),
  email: z.string().email('Invalid email address'),
  bio: localeObjectSchema.optional(),
  title: localeObjectSchema.optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

function Speaker() {
  const { speakerId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);
  const isNew = speakerId === 'add';

  const { data: speaker, isLoading } = useGetSpeakerQuery(speakerId, { skip: isNew });
  const [createSpeaker, { isLoading: isCreating }] = useCreateSpeakerMutation();
  const [updateSpeaker, { isLoading: isUpdating }] = useUpdateSpeakerMutation();
  const isSaving = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(speakerSchema),
    defaultValues: SpeakerModel(),
  });

  useEffect(() => {
    if (speaker && !isNew) {
      reset({
        ...speaker,
        name: ensureLocaleValue(speaker.name),
        title: ensureLocaleValue(speaker.title),
        bio: ensureLocaleValue(speaker.bio),
      });
    }
  }, [speaker, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      if (isNew) {
        await createSpeaker(data).unwrap();
        enqueueSnackbar('Speaker created successfully', { variant: 'success' });
      } else {
        await updateSpeaker({ id: speakerId, data }).unwrap();
        enqueueSnackbar('Speaker updated successfully', { variant: 'success' });
      }
      navigate('/speakers');
    } catch {
      enqueueSnackbar(`Failed to ${isNew ? 'create' : 'update'} speaker`, { variant: 'error' });
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
          { label: 'Speakers', href: '/speakers' },
          { label: isNew ? 'Add New Speaker' : 'Edit Speaker' },
        ]}
      />

      {/* Title + actions — no background */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tedx-dark">
          {isNew ? 'Add New Speaker' : 'Edit Speaker'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => navigate('/speakers')}
            className="border-gray-300 text-gray-500"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : <Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-tedx-red hover:bg-tedx-red-dark"
          >
            {isSaving ? 'Saving...' : 'Save Speaker'}
          </Button>
        </div>
      </div>

      <Paper
        elevation={0}
        sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, v) => setCurrentTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            '& .MuiTab-root.Mui-selected': { color: 'var(--color-primary)' },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' },
          }}
        >
          <Tab label="Basic Information" />
          <Tab label="Social Links" />
        </Tabs>
        <Box>
          {currentTab === 0 && <BasicInfoTab control={control} errors={errors} />}
          {currentTab === 1 && <SocialLinksTab control={control} errors={errors} />}
        </Box>
      </Paper>
    </div>
  );
}

export default Speaker;
