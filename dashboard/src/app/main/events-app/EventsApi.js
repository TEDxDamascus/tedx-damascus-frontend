import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Events', 'Event'];

const eventsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) => ({
        url: '/events', 
        method: 'GET',
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy, sortDir } : {}),
        },
      }),
      providesTags: ['Events'],
    }),
    getEvent: builder.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['Event'],
    }),
    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: `/events`,
        method: 'POST',
        data: newEvent,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Events', 'Event'],
    }),
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;

export default eventsApi;