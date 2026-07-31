import { apiClient } from './client';
import { Blog, BlogsQueryParams, BlogsResponse, Category, CategoriesResponse, BlogResponse } from './blogs.types';

export const blogsService = {
  /**
   * Fetch blogs with pagination and filtering
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated blogs response
   */
  async getBlogs(params?: BlogsQueryParams): Promise<BlogsResponse> {
    const defaultParams: BlogsQueryParams = {
      page: 1,
      limit: 10,
      lang: 'en',
      sort: 'createdAt',
      order: 'desc',
      status: 'published',
    };

    const queryParams = { ...defaultParams, ...params };
    
    return apiClient.get<BlogsResponse>('/public/blogs', { params: queryParams });
  },

  /**
   * Search blogs by query string
   * @param searchQuery - Search query string
   * @param lang - Language code ('en' or 'ar')
   * @param params - Additional query parameters
   * @returns Promise with blogs response
   */
  async searchBlogs(searchQuery: string, lang: string = 'en', params?: Partial<BlogsQueryParams>): Promise<BlogsResponse> {
    const queryParams: BlogsQueryParams = {
      page: 1,
      limit: 10,
      lang,
      search: searchQuery,
      sort: 'createdAt',
      order: 'desc',
      ...params,
    };
    
    return apiClient.get<BlogsResponse>('/blogs', { params: queryParams });
  },

  /**
   * Fetch categories
   * @param lang - Language code ('en' or 'ar')
   * @returns Promise with categories response
   */
  async getCategories(lang: string = 'en'): Promise<Category[]> {
    const response = await apiClient.get<CategoriesResponse>('/categories', {
      params: { lang },
    });
    return response.data;
  },

  /**
   * Fetch a single blog by slug
   * @param slug - Blog slug
   * @param locale - Language locale (ar or en)
   * @returns Promise with blog response
   */
  async getBlogBySlug(slug: string, locale: string = 'en'): Promise<BlogResponse> {
    return apiClient.get<BlogResponse>(`/public/blogs/${slug}`, {
      params: { lang: locale },
    });
  },

  /**
   * Fetch a single blog by ID
   * @param id - Blog ID
   * @param locale - Language locale (ar or en)
   * @returns Promise with blog response
   */
  async getBlogById(id: string, locale: string = 'en'): Promise<BlogResponse> {
    return apiClient.get<BlogResponse>(`/public/blogs/${id}`, {
      params: { lang: locale },
    });
  },

  /**
   * Fetch related blogs by IDs
   * @param ids - Array of blog IDs
   * @param locale - Language locale (ar or en)
   * @returns Promise with array of blogs
   */
  async getRelatedBlogs(ids: string[], locale: string = 'en'): Promise<Blog[]> {
    if (!ids || ids.length === 0) return [];
    return apiClient.get<Blog[]>(`/public/blogs/related?ids=${ids.join(',')}&lang=${locale}`);
  },
};
