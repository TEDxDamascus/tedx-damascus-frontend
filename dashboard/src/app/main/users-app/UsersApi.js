import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Users', 'User'];

const usersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, pageSize = 10, search, sortBy, sortDir, status } = {}) => ({
        url: '/users',
        method: 'GET',
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy, sortDir } : {}),
          ...(status ? { status } : {}),
        },
      }),
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: `/users`,
        method: 'POST',
        data: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Users', 'User'],
    }),
    bulkUpdateUsers: builder.mutation({
      query: ({ ids, data }) => ({
        url: `/users/bulk-update`,
        method: 'PATCH',
        data: { ids, ...data },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useBulkUpdateUsersMutation,
} = usersApi;
