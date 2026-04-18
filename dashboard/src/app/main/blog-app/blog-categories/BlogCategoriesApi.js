import { apiService } from 'app/store/apiService';

export const addTagTypes = ['BlogCategories', 'BlogCategory'];

const now = () => new Date().toISOString();
const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

let mockCategories = [
  {
    id: 'cat-news',
    name: 'news',
    description: 'News and announcements',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-community',
    name: 'community',
    description: '',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
];

export async function searchBlogCategoryOptions(query) {
  await wait(80);
  const term = String(query || '').trim().toLowerCase();
  return mockCategories
    .filter((c) => {
      if (!term) return true;
      return (
        (c.name || '').toLowerCase().includes(term) ||
        (c.description || '').toLowerCase().includes(term)
      );
    })
    .slice(0, 20)
    .map((c) => ({
      id: c.id,
      label: (c.name || '').trim() || c.id,
    }));
}

const blogCategoriesApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getBlogCategories: builder.query({
      async queryFn() {
        await wait();
        return {
          data: {
            success: true,
            data: { items: [...mockCategories], total: mockCategories.length },
          },
        };
      },
      providesTags: ['BlogCategories'],
    }),

    createBlogCategory: builder.mutation({
      async queryFn({ name = '', description = '' } = {}) {
        await wait();
        const row = {
          id: `cat-${Date.now()}`,
          name: String(name).trim(),
          description: String(description).trim(),
          createdAt: now(),
          updatedAt: now(),
        };
        mockCategories = [row, ...mockCategories];
        return { data: { success: true, data: row } };
      },
      invalidatesTags: ['BlogCategories'],
    }),

    updateBlogCategory: builder.mutation({
      async queryFn({ id, name, description }) {
        await wait();
        const i = mockCategories.findIndex((c) => c.id === id);
        if (i < 0) return { error: { status: 404, data: 'Category not found' } };
        mockCategories[i] = {
          ...mockCategories[i],
          name: name !== undefined ? String(name).trim() : mockCategories[i].name,
          description:
            description !== undefined ? String(description).trim() : mockCategories[i].description,
          updatedAt: now(),
        };
        return { data: { success: true, data: mockCategories[i] } };
      },
      invalidatesTags: ['BlogCategories'],
    }),

    deleteBlogCategory: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mockCategories.length;
        mockCategories = mockCategories.filter((c) => c.id !== id);
        if (before === mockCategories.length) {
          return { error: { status: 404, data: 'Category not found' } };
        }
        return { data: { success: true } };
      },
      invalidatesTags: ['BlogCategories'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoriesApi;

export default blogCategoriesApi;
