import { apiService } from 'app/store';

const storageApi = apiService.enhanceEndpoints({ addTagTypes: ['StorageMedia'] }).injectEndpoints({
  endpoints: (builder) => ({
    getMediaItems: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/storage/media',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['StorageMedia'],
    }),
    uploadMedia: builder.mutation({
      query: (formData) => ({
        url: '/storage/upload',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['StorageMedia'],
    }),
    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `/storage/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StorageMedia'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMediaItemsQuery, useUploadMediaMutation, useDeleteMediaMutation } = storageApi;
export default storageApi;
