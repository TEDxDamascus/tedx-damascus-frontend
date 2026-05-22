import { useState, useMemo } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Breadcrumb from '../../../shared-components/breadcrumb';
import { useSnackbar } from 'notistack';
import {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} from './BlogCategoriesApi';
import {
  LocaleInput,
  defaultLocaleValue,
  ensureLocaleValue,
  localeInputTypes,
} from '../../../shared-components/locale-input';

function getLocalizedText(value, locale = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value[locale] || value.en || value.ar || '';
  return '';
}

function emptyForm() {
  return { name: defaultLocaleValue(), description: defaultLocaleValue() };
}

function BlogCategoriesList() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetBlogCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateBlogCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateBlogCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteBlogCategoryMutation();

  const items = useMemo(() => {
    const raw = data?.data?.items ?? data?.items ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const [listLocale, setListLocale] = useState('en');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleListLocaleChange = (_, value) => {
    if (value) setListLocale(value);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: ensureLocaleValue(row.nameLocales ?? { en: row.name, ar: row.name }),
      description: ensureLocaleValue(
        row.descriptionLocales ?? { en: row.description, ar: row.description },
      ),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...form }).unwrap();
        enqueueSnackbar('Category updated', { variant: 'success' });
      } else {
        await createCategory(form).unwrap();
        enqueueSnackbar('Category created', { variant: 'success' });
      }
      closeDialog();
    } catch {
      enqueueSnackbar('Could not save category', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id).unwrap();
      enqueueSnackbar('Category deleted', { variant: 'success' });
    } catch {
      enqueueSnackbar('Could not delete category', { variant: 'error' });
    }
  };

  const dash = (v) => (v != null && String(v).trim() !== '' ? v : '—');

  return (
    <div className="p-6 pt-8">
      <Breadcrumb items={[{ label: 'Blog', href: '/blogs' }, { label: 'Categories' }]} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-tedx-dark">Blog categories</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={listLocale}
            onChange={handleListLocaleChange}
            aria-label="category list locale"
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="ar">AR</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'var(--color-primary)',
              color: '#fff',
              '&:hover': { bgcolor: 'var(--color-primary-dark)', color: '#fff' },
            }}
            onClick={openCreate}
          >
            Add category
          </Button>
        </div>
      </div>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Name and description are optional. They appear when assigning a category to an article.
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, width: 120 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No categories yet.</TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell dir={listLocale === 'ar' ? 'rtl' : 'ltr'}>
                      {dash(
                        getLocalizedText(
                          row.nameLocales ?? { en: row.name, ar: row.name },
                          listLocale,
                        ),
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 480 }} dir={listLocale === 'ar' ? 'rtl' : 'ltr'}>
                      {dash(
                        getLocalizedText(
                          row.descriptionLocales ?? {
                            en: row.description,
                            ar: row.description,
                          },
                          listLocale,
                        ),
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Edit" onClick={() => openEdit(row)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Delete"
                        disabled={isDeleting}
                        onClick={() => handleDelete(row.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit category' : 'Add category'}</DialogTitle>
        <DialogContent>
          <StackFields form={form} setForm={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            sx={{
              bgcolor: 'var(--color-primary)',
              color: '#fff',
              '&:hover': { bgcolor: 'var(--color-primary-dark)', color: '#fff' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.65)' },
            }}
          >
            {isCreating || isUpdating ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function StackFields({ form, setForm }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <LocaleInput
        label="Name"
        type={localeInputTypes.textField}
        value={form.name}
        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        placeholder="Optional"
      />
      <LocaleInput
        label="Description"
        type={localeInputTypes.textFieldMultiple}
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
        placeholder="Optional"
        minRows={2}
      />
    </Box>
  );
}

export default BlogCategoriesList;
