import { Button, CircularProgress, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../shared-components/breadcrumb';
import { useDeleteBlogMutation, useGetBlogsQuery, useUpdateBlogMutation } from '../BlogsApi';

function extractItems(raw) {
  const candidates = [
    raw?.data?.items,
    raw?.data?.blogs,
    raw?.data?.results,
    raw?.data,
    raw?.items,
    raw?.blogs,
    raw?.results,
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

function formatReadTime(readTime) {
  const minutes = Number(readTime);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  return `${minutes} min read`;
}

function BlogsList() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState('en');
  const { data, isLoading } = useGetBlogsQuery({ page: 1, limit: 20 });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const blogs = extractItems(data);
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const filteredBlogs = safeBlogs.filter(
    (blog) => getLocalizedText(blog.title, locale).trim().length > 0,
  );

  const handleLocaleChange = (_, value) => {
    if (value) setLocale(value);
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this blog article?')) return;
    await deleteBlog(id);
  };

  const handleTogglePublish = async (blog) => {
    const id = blog.id || blog._id;
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await updateBlog({ id, data: { status: newStatus } });
  };

  return (
    <div className="p-6 pt-8">
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tedx-dark">Blog</h1>
        <div className="flex items-center gap-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={locale}
            onChange={handleLocaleChange}
            aria-label="blog locale toggle"
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="ar">AR</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary-dark)' } }}
            onClick={() => navigate('/blogs/add')}
          >
            Add New Article
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <CircularProgress size={24} />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-6 text-gray-600">No blogs found.</div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.map((blog) => {
              const id = blog.id || blog._id;
              const isPublished = blog.status === 'published';
              return (
                <div
                  key={id}
                  className="flex items-center gap-4 rounded-md border border-gray-100 p-3"
                >
                  {/* Thumbnail — left of title */}
                  <div className="flex-shrink-0">
                    {blog.blog_image ? (
                      <img
                        src={blog.blog_image}
                        alt={getLocalizedText(blog.title, locale)}
                        className="h-16 w-24 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">
                      {getLocalizedText(blog.title, locale)}
                    </div>
                    {!!getLocalizedText(blog.description, locale) && (
                      <div className="truncate text-sm text-gray-500">
                        {getLocalizedText(blog.description, locale)}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-2">
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
                      {blog.category && (
                        <span className="text-xs text-gray-400">{blog.category}</span>
                      )}
                      {formatReadTime(blog.read_time) && (
                        <span className="text-xs text-gray-400">
                          {formatReadTime(blog.read_time)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-shrink-0 flex-col gap-1.5">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/blogs/${id}`)}
                      sx={{ minWidth: 80 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isUpdating}
                      onClick={() => handleTogglePublish(blog)}
                      sx={{
                        minWidth: 80,
                        color: isPublished ? '#616161' : 'var(--color-primary)',
                        borderColor: isPublished ? '#9E9E9E' : 'var(--color-primary)',
                        '&:hover': {
                          borderColor: isPublished ? '#616161' : 'var(--color-primary-dark)',
                        },
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
                      sx={{ minWidth: 80 }}
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

export default BlogsList;
