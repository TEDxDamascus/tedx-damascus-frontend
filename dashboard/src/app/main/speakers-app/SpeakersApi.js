import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Speakers', 'Speaker'];

const speakersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getSpeakers: builder.query({
      query: ({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) => ({
        url: '/speakers',
        method: 'GET',
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy, sortDir } : {}),
        },
      }),
      providesTags: ['Speakers'],
    }),
    getSpeaker: builder.query({
      query: (speakerId) => ({
        url: `/speakers/${speakerId}`,
        method: 'GET',
      }),
      providesTags: ['Speaker'],
    }),
    createSpeaker: builder.mutation({
      query: (newSpeaker) => ({
        url: `/speakers`,
        method: 'POST',
        data: newSpeaker,
      }),
      invalidatesTags: ['Speakers'],
    }),
    updateSpeaker: builder.mutation({
      query: ({ id, data }) => ({
        url: `/speakers/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Speakers', 'Speaker'],
    }),
    deleteSpeaker: builder.mutation({
      query: (speakerId) => ({
        url: `/speakers/${speakerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Speakers'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSpeakersQuery,
  useGetSpeakerQuery,
  useCreateSpeakerMutation,
  useUpdateSpeakerMutation,
  useDeleteSpeakerMutation,
} = speakersApi;

export default speakersApi;
