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
  useGetPartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
} from '../PartnersApi';
import BasicInfoTab from './tabs/BasicInfoTab';
import PartnerModel from './models/PartnerModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';

const localeObjectSchema = z.object({ ar: z.string(), en: z.string() });

const partnerSchema = z.object({
  title: localeObjectSchema.refine((v) => v?.en?.trim() || v?.ar?.trim(), 'Title is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  description: localeObjectSchema.optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  type: z.string().min(1, 'Partner type is required'),
  active: z.boolean().optional(),
});

function Partner() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);
  const isNew = partnerId === 'add';

  const { data: partner, isLoading } = useGetPartnerQuery(partnerId, { skip: isNew });
  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
  const isSaving = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: PartnerModel(),
  });

  useEffect(() => {
    if (partner && !isNew) {
      reset({
        ...partner,
        title: ensureLocaleValue(partner.title),
        description: ensureLocaleValue(partner.description),
        image: partner.image || '',
        type: partner.type || '',
        phone: partner.phone || '',
        email: partner.email || '',
      });
    }
  }, [partner, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      if (isNew) {
        await createPartner(data).unwrap();
        enqueueSnackbar('Partner created successfully', { variant: 'success' });
      } else {
        await updatePartner({ id: partnerId, data }).unwrap();
        enqueueSnackbar('Partner updated successfully', { variant: 'success' });
      }
      navigate('/partners');
    } catch {
      enqueueSnackbar(`Failed to ${isNew ? 'create' : 'update'} partner`, { variant: 'error' });
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
          { label: 'Partners', href: '/partners' },
          { label: isNew ? 'Add New Partner' : 'Edit Partner' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tedx-dark">
          {isNew ? 'Add New Partner' : 'Edit Partner'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => navigate('/partners')}
            className="border-gray-300 text-gray-500"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : <Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            sx={{
              bgcolor: 'var(--color-primary)',
              '&:hover': { bgcolor: 'var(--color-primary-dark)' },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Partner'}
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
          <Tab label="Partner Information" />
        </Tabs>
        <Box>{currentTab === 0 && <BasicInfoTab control={control} errors={errors} />}</Box>
      </Paper>
    </div>
  );
}

export default Partner;
