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
  useGetTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
} from '../teamApi';
import BasicInfoTab from './tabs/BasicInfoTab';
import SocialLinksTab from './tabs/SocialLinksTab';
import TeamMemberModel from './models/TeamMemberModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';

const localeObjectSchema = z.object({ ar: z.string(), en: z.string() });

const teamMemberSchema = z.object({
  name: localeObjectSchema.refine((v) => v?.en?.trim() || v?.ar?.trim(), 'Name is required'),
  role: localeObjectSchema.refine((v) => v?.en?.trim() || v?.ar?.trim(), 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  bio: localeObjectSchema.optional(),
  photo: z.string().optional(),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  active: z.boolean().optional(),
});

function TeamMember() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);
  const isNew = memberId === 'add';

  const { data: member, isLoading } = useGetTeamMemberQuery(memberId, { skip: isNew });
  const [createMember, { isLoading: isCreating }] = useCreateTeamMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const isSaving = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: TeamMemberModel(),
  });

  useEffect(() => {
    if (member && !isNew) {
      reset({
        ...member,
        name: ensureLocaleValue(member.name),
        role: ensureLocaleValue(member.role),
        bio: ensureLocaleValue(member.bio),
      });
    }
  }, [member, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      if (isNew) {
        await createMember(data).unwrap();
        enqueueSnackbar('Member created successfully', { variant: 'success' });
      } else {
        await updateMember({ id: memberId, data }).unwrap();
        enqueueSnackbar('Member updated successfully', { variant: 'success' });
      }
      navigate('/team');
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <div className="p-6 pt-8">
      <Breadcrumb items={[{ label: 'Team', href: '/team' }, { label: isNew ? 'Add' : 'Edit' }]} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isNew ? 'Add Member' : 'Edit Member'}</h1>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          Save Member
        </Button>
      </div>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="Basic Info" />
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

export default TeamMember;
