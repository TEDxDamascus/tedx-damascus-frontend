import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import {
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useRemoveQuestionMutation,
  usePublishFormMutation,
  useUnpublishFormMutation,
} from '../FormsApi';
import { createQuestion } from './questionUtils';

const DEFAULT_SETTINGS = {
  name: { en: '', ar: '' },
  description: { en: '', ar: '' },
  targetRole: 'Speaker',
  starts_at: '',
  ends_at: '',
  expires_at: '',
  max_submissions: '',
};

export function useFormBuilder(formId) {
  const isNew = formId === 'add';
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const didReset = useRef(false);

  const { data: formResponse, isLoading: isFormLoading } = useGetFormQuery(formId, {
    skip: isNew,
  });
  const form = formResponse?.data;

  const settingsForm = useForm({ defaultValues: DEFAULT_SETTINGS });
  const { reset } = settingsForm;

  useEffect(() => {
    if (form && !didReset.current) {
      reset({
        name: form.name ?? { en: '', ar: '' },
        description: form.description ?? { en: '', ar: '' },
        targetRole: form.targetRole ?? 'Speaker',
        starts_at: form.starts_at ? form.starts_at.slice(0, 16) : '',
        ends_at: form.ends_at ? form.ends_at.slice(0, 16) : '',
        expires_at: form.expires_at ? form.expires_at.slice(0, 16) : '',
        max_submissions: form.max_submissions ?? '',
      });
      didReset.current = true;
    }
  }, [form, reset]);

  const [createForm, { isLoading: isCreating }] = useCreateFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation();
  const [addQuestionMutation, { isLoading: isAddingQuestion }] = useAddQuestionMutation();
  const [updateQuestionMutation] = useUpdateQuestionMutation();
  const [removeQuestionMutation] = useRemoveQuestionMutation();
  const [publishFormMutation, { isLoading: isPublishing }] = usePublishFormMutation();
  const [unpublishFormMutation, { isLoading: isUnpublishing }] = useUnpublishFormMutation();

  const saveSettings = settingsForm.handleSubmit(async (values) => {
    try {
      if (isNew) {
        const res = await createForm(values).unwrap();
        enqueueSnackbar('Form created', { variant: 'success' });
        navigate(`/forms/${res.data.id}`, { replace: true });
      } else {
        await updateForm({ id: formId, data: values }).unwrap();
        enqueueSnackbar('Settings saved', { variant: 'success' });
      }
    } catch {
      enqueueSnackbar('Failed to save settings', { variant: 'error' });
    }
  });

  const handleAddQuestion = async (type) => {
    const questions = form?.questions ?? [];
    try {
      await addQuestionMutation({
        formId,
        data: createQuestion(type, questions.length),
      }).unwrap();
    } catch {
      enqueueSnackbar('Failed to add question', { variant: 'error' });
    }
  };

  const handleUpdateQuestion = async (questionId, data) => {
    try {
      await updateQuestionMutation({ formId, questionId, data }).unwrap();
    } catch {
      enqueueSnackbar('Failed to update question', { variant: 'error' });
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    try {
      await removeQuestionMutation({ formId, questionId }).unwrap();
    } catch {
      enqueueSnackbar('Failed to remove question', { variant: 'error' });
    }
  };

  const handlePublish = async () => {
    try {
      await publishFormMutation(formId).unwrap();
      enqueueSnackbar('Form published', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to publish form', { variant: 'error' });
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishFormMutation(formId).unwrap();
      enqueueSnackbar('Form unpublished', { variant: 'info' });
    } catch {
      enqueueSnackbar('Failed to unpublish form', { variant: 'error' });
    }
  };

  // Normalize questions: ensure each has `id` (backend may return `_id`)
  const questions = (form?.questions ?? []).map((q) => ({
    ...q,
    id: q.id ?? q._id,
  }));

  return {
    isNew,
    form,
    isFormLoading,
    settingsForm,
    saveSettings,
    isSavingSettings: isCreating || isUpdating,
    questions,
    isAddingQuestion,
    handleAddQuestion,
    handleUpdateQuestion,
    handleRemoveQuestion,
    handlePublish,
    handleUnpublish,
    isPublishing,
    isUnpublishing,
  };
}
