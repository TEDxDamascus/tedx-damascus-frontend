import { apiClient } from './client';
import { BlogReferencesResponse } from './blog-references.types';

export const blogReferencesService = {
  /**
   * Fetch blog references by blog ID
   * @param blogId - The ID of the blog
   * @returns Promise with blog references response
   */
  async getBlogReferences(blogId: string): Promise<BlogReferencesResponse> {
    return apiClient.get<BlogReferencesResponse>('/blog-references', {
      params: {
        blog_id: blogId,
      },
    });
  },
};
