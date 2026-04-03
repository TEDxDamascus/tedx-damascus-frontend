import { Button, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../shared-components/breadcrumb';
import { useDeleteBlogMutation, useGetBlogsQuery } from '../BlogsApi';

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
  if (typeof value === 'object') {
    return value[locale] || '';
  }
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
  const blogs = extractItems(data);
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const filteredBlogs = safeBlogs.filter((blog) => {
    const localizedTitle = getLocalizedText(blog.title, locale).trim();
    return localizedTitle.length > 0;
  });
  const handleLocaleChange = (_, value) => {
    if (value) setLocale(value);
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this blog article?')) return;
    await deleteBlog(id);
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
            className="bg-tedx-red hover:bg-tedx-red-dark"
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
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id || blog._id}
                className="flex items-center justify-between rounded-md border border-gray-100 p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {getLocalizedText(blog.title, locale)}
                  </div>
                  {!!getLocalizedText(blog.description, locale) && (
                    <div className="text-sm text-gray-500">
                      {getLocalizedText(blog.description, locale)}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {blog.status || 'draft'} {blog.category ? `• ${blog.category}` : ''}
                  </div>
                  {formatReadTime(blog.read_time) && (
                    <div className="text-xs text-gray-500">{formatReadTime(blog.read_time)}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/blogs/${blog.id || blog._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={isDeleting}
                    onClick={() => handleDelete(blog.id || blog._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogsList;
