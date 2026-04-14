import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Blogs', 'Blog'];

const now = () => new Date().toISOString();
const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Mock database (aligned with Blog backend entity) ──────────────────────────
let mockBlogs = [
  {
    id: 'blog-1',
    title: { en: 'TEDx Damascus Launch', ar: 'إطلاق TEDx Damascus' },
    slug: { en: 'tedx-damascus-launch', ar: 'اطلاق-تيدكس-دمشق' },
    description: { en: 'Launch recap and highlights.', ar: 'ملخص الإطلاق وأهم اللحظات.' },
    content: {
      en: 'TEDx Damascus held its first event, bringing together visionaries from across Syria and the region.',
      ar: 'أقامت TEDx Damascus أول فعالياتها، جامعةً رواد الفكر من أنحاء سوريا والمنطقة.',
    },
    status: 'published',
    publishedAt: '2025-03-01T10:00:00Z',
    category: 'news',
    views_count: 142,
    read_time: 4,
    blog_image: '',
    og_image: '',
    gallery: [],
    meta_title: { en: 'TEDx Damascus Launch', ar: 'إطلاق TEDx Damascus' },
    meta_description: { en: 'Launch recap', ar: 'ملخص الإطلاق' },
    meta_keywords: { en: 'tedx,damascus,launch', ar: 'تيدكس,دمشق,إطلاق' },
    og_title: { en: 'TEDx Damascus', ar: 'TEDx Damascus' },
    og_description: { en: 'Official launch post', ar: 'منشور الإطلاق الرسمي' },
    canonical_url: '',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'blog-2',
    title: { en: 'Ideas Worth Spreading in Damascus', ar: 'أفكار تستحق الانتشار في دمشق' },
    slug: { en: 'ideas-worth-spreading', ar: 'افكار-تستحق-الانتشار' },
    description: {
      en: 'How TEDx is changing the conversation in Syria.',
      ar: 'كيف تغيّر TEDx مسار الحوار في سوريا.',
    },
    content: {
      en: 'Since its founding, TEDx Damascus has become a platform for bold ideas and inspiring stories.',
      ar: 'منذ تأسيسها، أصبحت TEDx Damascus منصةً للأفكار الجريئة والقصص الملهمة.',
    },
    status: 'draft',
    publishedAt: null,
    category: 'community',
    views_count: 0,
    read_time: 5,
    blog_image: '',
    og_image: '',
    gallery: [],
    meta_title: { en: 'Ideas Worth Spreading', ar: 'أفكار تستحق الانتشار' },
    meta_description: { en: '', ar: '' },
    meta_keywords: { en: '', ar: '' },
    og_title: { en: '', ar: '' },
    og_description: { en: '', ar: '' },
    canonical_url: '',
    createdAt: '2025-04-01T09:00:00Z',
    updatedAt: '2025-04-01T09:00:00Z',
  },
];

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
  const term = String(query || '').trim().toLowerCase();
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
        let filtered = mockBlogs.filter((blog) => {
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
            message: 'Blogs list',
            data: { items, total: filtered.length, page, limit },
          },
        };
      },
      providesTags: ['Blogs'],
    }),

    getBlog: builder.query({
      async queryFn(blogId) {
        await wait();
        const blog = mockBlogs.find((item) => matchBlogId(item, blogId));
        if (!blog) return { error: { status: 404, data: 'Blog not found' } };
        return { data: { success: true, statusCode: 200, data: blog } };
      },
      providesTags: ['Blog'],
    }),

    createBlog: builder.mutation({
      async queryFn(data) {
        await wait();
        const newBlog = {
          ...data,
          id: `blog-${Date.now()}`,
          views_count: 0,
          publishedAt: data.status === 'published' ? now() : null,
          createdAt: now(),
          updatedAt: now(),
        };
        mockBlogs = [newBlog, ...mockBlogs];
        return { data: { success: true, statusCode: 201, message: 'Blog created', data: newBlog } };
      },
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const index = mockBlogs.findIndex((item) => matchBlogId(item, id));
        if (index < 0) return { error: { status: 404, data: 'Blog not found' } };
        const prev = mockBlogs[index];
        const updated = {
          ...prev,
          ...data,
          publishedAt:
            data.status === 'published' && !prev.publishedAt ? now() : prev.publishedAt,
          updatedAt: now(),
        };
        mockBlogs[index] = updated;
        return { data: { success: true, statusCode: 200, message: 'Blog updated', data: updated } };
      },
      invalidatesTags: ['Blogs', 'Blog'],
    }),

    deleteBlog: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mockBlogs.length;
        mockBlogs = mockBlogs.filter((item) => !matchBlogId(item, id));
        if (before === mockBlogs.length) return { error: { status: 404, data: 'Blog not found' } };
        return { data: { success: true, statusCode: 200, message: 'Blog deleted' } };
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
