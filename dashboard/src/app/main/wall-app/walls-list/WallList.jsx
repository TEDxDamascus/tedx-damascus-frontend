import { Button, Chip, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../shared-components/breadcrumb';
import { useDeleteWallQuestionMutation, useGetWallQuestionsQuery, useUpdateWallQuestionMutation } from '../WallApi';

function extractItems(raw) {
  const candidates = [
    raw?.data?.items,
    raw?.data?.questions,
    raw?.data?.results,
    raw?.data,
    raw?.items,
    raw?.questions,
    raw,
  ];
  const match = candidates.find((candidate) => Array.isArray(candidate));
  return match ?? [];
}

function getLocalizedText(value, locale = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value[locale] || value.en || value.ar || '';
  return '';
}

function WallList() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState('en');
  const { data, isLoading } = useGetWallQuestionsQuery({ page: 1, limit: 50 });
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteWallQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateWallQuestionMutation();

  const items = extractItems(data);
  const questions = Array.isArray(items) ? items : [];

  const handleLocaleChange = (_, value) => {
    if (value) setLocale(value);
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this wall question and all its answers?')) return;
    await deleteQuestion(id);
  };

  const handleTogglePublish = async (q) => {
    const id = q.id || q._id;
    const newStatus = q.status === 'published' ? 'draft' : 'published';
    await updateQuestion({ id, data: { status: newStatus } });
  };

  return (
    <div className="p-6 pt-8">
      <Breadcrumb items={[{ label: 'Wall' }]} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-tedx-dark">Wall</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={locale}
            onChange={handleLocaleChange}
            aria-label="wall locale toggle"
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="ar">AR</ToggleButton>
          </ToggleButtonGroup>
          <Button component={Link} to="/wall/banned-words" variant="outlined" size="small">
            Banned words
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary-dark)' } }}
            onClick={() => navigate('/wall/add')}
          >
            New question
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <CircularProgress size={24} />
          </div>
        ) : questions.length === 0 ? (
          <div className="p-6 text-gray-600">No wall questions yet.</div>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => {
              const id = q.id || q._id;
              const isPublished = q.status === 'published';
              return (
                <div
                  key={id}
                  className="flex flex-col gap-3 rounded-md border border-gray-100 p-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      {getLocalizedText(q.title, locale) || '(Untitled)'}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Chip
                        label={isPublished ? 'Published' : 'Draft'}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                          bgcolor: isPublished ? '#4CAF5018' : '#9E9E9E18',
                          color: isPublished ? '#2E7D32' : '#616161',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col gap-1.5 sm:items-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/wall/${id}`)}
                      sx={{ minWidth: 100 }}
                    >
                      Edit & answers
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isUpdating}
                      onClick={() => handleTogglePublish(q)}
                      sx={{
                        minWidth: 100,
                        color: isPublished ? '#616161' : 'var(--color-primary)',
                        borderColor: isPublished ? '#9E9E9E' : 'var(--color-primary)',
                      }}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      disabled={isDeleting}
                      onClick={() => handleDelete(id)}
                      sx={{ minWidth: 100 }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WallList;
