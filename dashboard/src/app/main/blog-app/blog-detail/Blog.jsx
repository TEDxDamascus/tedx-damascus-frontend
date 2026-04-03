import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Paper, Button, CircularProgress, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import Breadcrumb from '../../../shared-components/breadcrumb';
import BlogContentSeoTab from './tabs/BlogContentSeoTab';
import BlogModel from './models/BlogModel';
import { ensureLocaleValue } from '../../../shared-components/locale-input';
import { useSnackbar } from 'notistack';
import { useCreateBlogMutation, useGetBlogQuery, useUpdateBlogMutation } from '../BlogsApi';
import { searchBlogOptions } from '../BlogsApi';

const localeObjectSchema = z.object({ ar: z.string(), en: z.string() });

const blogSchema = z.object({
  title: localeObjectSchema.refine((v) => v?.en?.trim() || v?.ar?.trim(), 'Title is required'),
  slug: localeObjectSchema,
  blog_image: z.string().optional(),
  read_time: z.coerce.number().min(0).optional(),
  related_blogs: z.array(z.any()).optional(),
  description: localeObjectSchema,
  content: localeObjectSchema,
  meta_title: localeObjectSchema,
  meta_description: localeObjectSchema,
  meta_keywords: localeObjectSchema,
  canonical_url: z.string().optional(),
  og_image: z.string().optional(),
  og_title: localeObjectSchema,
  og_description: localeObjectSchema,
  twitter_title: localeObjectSchema,
  twitter_description: localeObjectSchema,
  twitter_image: z.string().optional(),
  twitter_card: z.string().optional(),
});

function pickLocaleText(value) {
  const localeValue = ensureLocaleValue(value);
  return localeValue.en?.trim() || localeValue.ar?.trim() || '';
}

function sanitizeLocaleObject(value) {
  const localeValue = ensureLocaleValue(value);
  return {
    en: String(localeValue.en || '').trim(),
    ar: String(localeValue.ar || '').trim(),
  };
}

function buildSlug(value) {
  return value
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function generateSlugLocaleFromTitle(titleValue) {
  const titleLocale = ensureLocaleValue(titleValue);
  return {
    en: buildSlug(titleLocale.en || ''),
    ar: buildSlug(titleLocale.ar || ''),
  };
}

function mapBlogFromApi(raw) {
  const source = raw?.data ?? raw ?? {};
  return BlogModel({
    ...source,
    title: ensureLocaleValue(source.title),
    slug: ensureLocaleValue(source.slug),
    blog_image: source.blog_image || '',
    related_blogs: Array.isArray(source.related_blogs)
      ? source.related_blogs
      : Array.isArray(source.related_blog_ids)
        ? source.related_blog_ids.map((id) => ({ id, label: String(id) }))
        : [],
    description: ensureLocaleValue(source.description),
    content: ensureLocaleValue(source.content),
    meta_title: ensureLocaleValue(source.meta_title),
    meta_description: ensureLocaleValue(source.meta_description),
    meta_keywords: ensureLocaleValue(source.meta_keywords),
    canonical_url: source.canonical_url || '',
    og_image: source.og_image || '',
    og_title: ensureLocaleValue(source.og_title),
    og_description: ensureLocaleValue(source.og_description),
    twitter_title: ensureLocaleValue(source.twitter_title),
    twitter_description: ensureLocaleValue(source.twitter_description),
    twitter_image: source.twitter_image || '',
    twitter_card: source.twitter_card || 'summary_large_image',
  });
}

function formatReadTime(readTime) {
  const minutes = Number(readTime);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  return `${minutes} min read`;
}

function Blog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isNew = blogId === 'add';
  const { data: blogData, isLoading } = useGetBlogQuery(blogId, { skip: isNew });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const isSaving = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: BlogModel(),
  });
  const currentReadTime = useWatch({ control, name: 'read_time' });

  useEffect(() => {
    if (blogData && !isNew) {
      reset(mapBlogFromApi(blogData));
    }
  }, [blogData, isNew, reset]);

  const handleGenerateSlug = () => {
    const generatedSlug = generateSlugLocaleFromTitle(getValues('title'));
    setValue('slug', generatedSlug, { shouldDirty: true, shouldValidate: true });
  };

  const fetchRelatedBlogsOptions = (query) => searchBlogOptions(query, { excludeId: blogId });

  const onSubmit = async (data) => {
    const slugValue = ensureLocaleValue(data.slug);
    const hasManualSlug = slugValue.en?.trim() || slugValue.ar?.trim();
    const finalSlug = hasManualSlug ? slugValue : generateSlugLocaleFromTitle(data.title);

    const payload = {
      title: sanitizeLocaleObject(data.title),
      slug: finalSlug,
      blog_image: data.blog_image || undefined,
      description: sanitizeLocaleObject(data.description),
      content: sanitizeLocaleObject(data.content),
      status: data.status || 'draft',
      category: data.category || undefined,
      read_time: Number(data.read_time) || undefined,
      related_blogs: (data.related_blogs || []).map((item) => item?.id ?? item?.value).filter(Boolean),
      meta_title: sanitizeLocaleObject(data.meta_title),
      meta_description: sanitizeLocaleObject(data.meta_description),
      meta_keywords: sanitizeLocaleObject(data.meta_keywords),
      canonical_url: data.canonical_url?.trim() || undefined,
      og_image: data.og_image?.trim() || undefined,
      og_title: sanitizeLocaleObject(data.og_title),
      og_description: sanitizeLocaleObject(data.og_description),
      twitter_title: sanitizeLocaleObject(data.twitter_title),
      twitter_description: sanitizeLocaleObject(data.twitter_description),
      twitter_image: data.twitter_image?.trim() || undefined,
      twitter_card: data.twitter_card?.trim() || undefined,
      gallery: Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : undefined,
    };

    try {
      if (isNew) {
        await createBlog(payload).unwrap();
        enqueueSnackbar('Blog created successfully', { variant: 'success' });
      } else {
        await updateBlog({ id: blogId, data: payload }).unwrap();
        enqueueSnackbar('Blog updated successfully', { variant: 'success' });
      }
      navigate('/blogs');
    } catch {
      enqueueSnackbar(`Failed to ${isNew ? 'create' : 'update'} blog`, { variant: 'error' });
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
          { label: 'Blog', href: '/blogs' },
          { label: isNew ? 'Add New Article' : 'Edit Article' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tedx-dark">{isNew ? 'Add New Article' : 'Edit Article'}</h1>
          {formatReadTime(currentReadTime) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatReadTime(currentReadTime)}
            </Typography>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => navigate('/blogs')}
            className="border-gray-300 text-gray-500"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : <Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isSaving}
            className="bg-tedx-red hover:bg-tedx-red-dark"
          >
            {isSubmitting || isSaving ? 'Saving...' : 'Save Article'}
          </Button>
        </div>
      </div>

      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <Box>
          <BlogContentSeoTab
            control={control}
            errors={errors}
            onGenerateSlug={handleGenerateSlug}
            slugPreviewBase="/blog"
            fetchRelatedBlogsOptions={fetchRelatedBlogsOptions}
          />
        </Box>
      </Paper>
    </div>
  );
}

export default Blog;
