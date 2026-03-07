import { apiService } from 'app/store';

const storageApi = apiService
  .enhanceEndpoints({ addTagTypes: ['StorageMedia'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMediaItems: builder.query({
        query: ({ page = 1, limit = 20 } = {}) => ({
          url: '/storage/media',
          method: 'GET',
          params: { page, limit }
        }),
        providesTags: ['StorageMedia']
      }),
      uploadMedia: builder.mutation({
        query: (formData) => ({
          url: '/storage/media',
          method: 'POST',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        invalidatesTags: ['StorageMedia']
      })
    }),
    overrideExisting: false
  });

export const { useGetMediaItemsQuery, useUploadMediaMutation } = storageApi;
export default storageApi;
