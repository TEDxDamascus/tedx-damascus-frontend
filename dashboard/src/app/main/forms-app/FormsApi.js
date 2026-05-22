import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Forms', 'Form', 'FormSubmissions'];

const formsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => ({ url: '/forms', method: 'GET' }),
      transformResponse: (response) => {
        const items = (response?.data ?? []).map((f) => ({ ...f, id: f._id || f.id }));
        return { data: items };
      },
      providesTags: ['Forms'],
    }),

    getForm: builder.query({
      query: (formId) => ({ url: `/forms/${formId}`, method: 'GET' }),
      transformResponse: (response) => {
        const f = response?.data ?? response;
        return { data: { ...f, id: f._id || f.id, questions: f.questions ?? [] } };
      },
      providesTags: ['Form'],
    }),

    createForm: builder.mutation({
      query: (data) => ({ url: '/forms', method: 'POST', data }),
      transformResponse: (response) => {
        const f = response?.data ?? response;
        return { data: { ...f, id: f._id || f.id } };
      },
      invalidatesTags: ['Forms'],
    }),

    updateForm: builder.mutation({
      query: ({ id, data }) => ({ url: `/forms/${id}`, method: 'PATCH', data }),
      transformResponse: (response) => {
        const f = response?.data ?? response;
        return { data: { ...f, id: f._id || f.id } };
      },
      invalidatesTags: ['Forms', 'Form'],
    }),

    deleteForm: builder.mutation({
      query: (id) => ({ url: `/forms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Forms'],
    }),

    addQuestion: builder.mutation({
      query: ({ formId, data }) => ({
        url: `/forms/${formId}/questions`,
        method: 'POST',
        data,
      }),
      transformResponse: (response) => {
        const d = response?.data ?? response;
        return { data: d };
      },
      invalidatesTags: ['Form'],
    }),

    updateQuestion: builder.mutation({
      query: ({ formId, questionId, data }) => ({
        url: `/forms/${formId}/questions/${questionId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Form'],
    }),

    removeQuestion: builder.mutation({
      query: ({ formId, questionId }) => ({
        url: `/forms/${formId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Form'],
    }),

    publishForm: builder.mutation({
      query: (formId) => ({ url: `/forms/${formId}/publish`, method: 'POST' }),
      invalidatesTags: ['Forms', 'Form'],
    }),

    unpublishForm: builder.mutation({
      query: (formId) => ({ url: `/forms/${formId}/unpublish`, method: 'POST' }),
      invalidatesTags: ['Forms', 'Form'],
    }),

    getFormSubmissions: builder.query({
      query: ({ formId, page = 1, pageSize = 10 }) => ({
        url: `/forms/${formId}/submissions`,
        method: 'GET',
        params: { page, limit: pageSize },
      }),
      transformResponse: (response) => {
        const items = (response?.data ?? []).map((s) => ({ ...s, id: s._id || s.id }));
        return {
          data: {
            items,
            total: response?.total ?? items.length,
            page: response?.page,
            pageSize: response?.limit,
          },
        };
      },
      providesTags: ['FormSubmissions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useRemoveQuestionMutation,
  usePublishFormMutation,
  useUnpublishFormMutation,
  useGetFormSubmissionsQuery,
} = formsApi;

export default formsApi;
