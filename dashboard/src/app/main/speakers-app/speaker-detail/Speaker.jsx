import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, Tab, Box, Paper, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  useGetSpeakerQuery,
  useCreateSpeakerMutation,
  useUpdateSpeakerMutation
} from '../SpeakersApi';
import SpeakerHeader from './SpeakerHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import SocialLinksTab from './tabs/SocialLinksTab';
import SpeakerModel from './models/SpeakerModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';

const localeObjectSchema = z.object({
  ar: z.string(),
  en: z.string()
});

const speakerSchema = z.object({
  name: localeObjectSchema.refine(
    (v) => (v?.en?.trim() || v?.ar?.trim()),
    'Name is required'
  ),
  email: z.string().email('Invalid email address'),
  bio: localeObjectSchema.optional(),
  title: localeObjectSchema.optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional()
  }).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional()
});

function Speaker() {
  const { speakerId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);

  const isNew = speakerId === 'add';

  const { data: speaker, isLoading } = useGetSpeakerQuery(speakerId, {
    skip: isNew
  });

  const [createSpeaker, { isLoading: isCreating }] = useCreateSpeakerMutation();
  const [updateSpeaker, { isLoading: isUpdating }] = useUpdateSpeakerMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(speakerSchema),
    defaultValues: SpeakerModel()
  });

  useEffect(() => {
    if (speaker && !isNew) {
      reset({
        ...speaker,
        name: ensureLocaleValue(speaker.name),
        title: ensureLocaleValue(speaker.title),
        bio: ensureLocaleValue(speaker.bio)
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
    } catch (error) {
      enqueueSnackbar(`Failed to ${isNew ? 'create' : 'update'} speaker`, {
        variant: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress sx={{ color: '#EB0028' }} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <SpeakerHeader
        onSave={handleSubmit(onSubmit)}
        isNew={isNew}
        isSaving={isCreating || isUpdating}
      />

      <Box sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 3,
              '& .MuiTab-root.Mui-selected': {
                color: '#EB0028'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#EB0028'
              }
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
      </Box>
    </div>
  );
}

export default Speaker;
