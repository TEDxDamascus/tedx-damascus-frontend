import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Blogs', 'Blog'];

const now = () => new Date().toISOString();

let mockBlogs = [
  {
    id: 'blog-1',
    title: { en: 'TEDx Damascus Launch', ar: 'إطلاق TEDx Damascus' },
    slug: 'tedx-damascus-launch',
    description: { en: 'Launch recap and highlights.', ar: 'ملخص الإطلاق وأهم اللحظات.' },
    content: {
      en: 'This is a mock article to keep development moving before backend integration.',
      ar: 'هذا مقال تجريبي لمتابعة التطوير قبل ربط الباك إند.',
    },
    status: 'published',
    category: 'news',
    read_time: 4,
    meta_title: { en: 'TEDx Damascus Launch', ar: 'إطلاق TEDx Damascus' },
    meta_description: { en: 'Launch recap', ar: 'ملخص الإطلاق' },
    meta_keywords: { en: 'tedx,damascus,launch', ar: 'تيدكس,دمشق,إطلاق' },
    og_title: { en: 'TEDx Damascus', ar: 'TEDx Damascus' },
    og_description: { en: 'Official launch post', ar: 'منشور الإطلاق الرسمي' },
    blog_image: '',
    gallery: [],
    createdAt: now(),
    updatedAt: now(),
  },
];

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

function matchBlogId(blog, id) {
  return String(blog.id) === String(id) || String(blog._id) === String(id);
}

function getBlogTitle(blog) {
  if (typeof blog?.title === 'string') return blog.title;
  if (blog?.title && typeof blog.title === 'object') {
    return blog.title.en || blog.title.ar || 'Untitled';
  }
  return 'Untitled';
}

export async function searchBlogOptions(query, { excludeId } = {}) {
  await wait(80);
  const term = String(query || '')
    .trim()
    .toLowerCase();
  return mockBlogs
    .filter((blog) => !excludeId || !matchBlogId(blog, excludeId))
    .filter((blog) => {
      if (!term) return true;
      const title = getBlogTitle(blog).toLowerCase();
      const slug =
        typeof blog.slug === 'string'
          ? blog.slug.toLowerCase()
          : `${blog?.slug?.en || ''} ${blog?.slug?.ar || ''}`.toLowerCase();
      return title.includes(term) || slug.includes(term);
    })
    .slice(0, 20)
    .map((blog) => ({
      id: blog.id || blog._id,
      label: getBlogTitle(blog),
    }));
}

const blogsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      async queryFn({ page = 1, limit = 10, status, category } = {}) {
        await wait();
        const filtered = mockBlogs.filter((blog) => {
          if (status && blog.status !== status) return false;
          if (category && blog.category !== category) return false;
          return true;
        });
        const start = (page - 1) * limit;
        const items = filtered.slice(start, start + limit);
        return {
          data: {
            success: true,
            statusCode: 200,
            message: 'Mock blogs list',
            data: {
              items,
              total: filtered.length,
              page,
              limit,
            },
          },
        };
      },
      providesTags: ['Blogs'],
    }),
    getBlog: builder.query({
      async queryFn(blogId) {
        await wait();
        const blog = mockBlogs.find((item) => matchBlogId(item, blogId));
        if (!blog) {
          return {
            error: {
              status: 404,
              data: 'Blog not found',
            },
          };
        }
        return {
          data: {
            success: true,
            statusCode: 200,
            data: blog,
          },
        };
      },
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation({
      async queryFn(data) {
        await wait();
        const newBlog = {
          ...data,
          id: `blog-${Date.now()}`,
          createdAt: now(),
          updatedAt: now(),
        };
        mockBlogs = [newBlog, ...mockBlogs];
        return {
          data: {
            success: true,
            statusCode: 201,
            message: 'Mock blog created',
            data: newBlog,
          },
        };
      },
      invalidatesTags: ['Blogs'],
    }),
    updateBlog: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const index = mockBlogs.findIndex((item) => matchBlogId(item, id));
        if (index < 0) {
          return {
            error: {
              status: 404,
              data: 'Blog not found',
            },
          };
        }
        const updated = {
          ...mockBlogs[index],
          ...data,
          updatedAt: now(),
        };
        mockBlogs[index] = updated;
        return {
          data: {
            success: true,
            statusCode: 200,
            message: 'Mock blog updated',
            data: updated,
          },
        };
      },
      invalidatesTags: ['Blogs', 'Blog'],
    }),
    deleteBlog: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mockBlogs.length;
        mockBlogs = mockBlogs.filter((item) => !matchBlogId(item, id));
        if (before === mockBlogs.length) {
          return {
            error: {
              status: 404,
              data: 'Blog not found',
            },
          };
        }
        return {
          data: {
            success: true,
            statusCode: 200,
            message: 'Mock blog deleted',
          },
        };
      },
      invalidatesTags: ['Blogs'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogsApi;

export default blogsApi;
