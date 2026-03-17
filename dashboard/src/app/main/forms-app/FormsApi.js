import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Forms', 'Form', 'FormSubmissions'];

const formsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => ({ url: '/forms', method: 'GET' }),
      providesTags: ['Forms'],
    }),
    getForm: builder.query({
      query: (formId) => ({ url: `/forms/${formId}`, method: 'GET' }),
      providesTags: ['Form'],
    }),
    createForm: builder.mutation({
      query: (data) => ({ url: '/forms', method: 'POST', data }),
      invalidatesTags: ['Forms'],
    }),
    updateForm: builder.mutation({
      query: ({ id, data }) => ({ url: `/forms/${id}`, method: 'PATCH', data }),
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
    getFormSubmissions: builder.query({
      query: ({ formId, page = 1, pageSize = 10 }) => ({
        url: `/forms/${formId}/submissions`,
        method: 'GET',
        params: { page, pageSize },
      }),
      providesTags: ['FormSubmissions'],
    }),
    publishForm: builder.mutation({
      query: (formId) => ({ url: `/forms/${formId}/publish`, method: 'POST' }),
      invalidatesTags: ['Forms', 'Form'],
    }),
    unpublishForm: builder.mutation({
      query: (formId) => ({ url: `/forms/${formId}/unpublish`, method: 'POST' }),
      invalidatesTags: ['Forms', 'Form'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useGetFormSubmissionsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useRemoveQuestionMutation,
  usePublishFormMutation,
  useUnpublishFormMutation,
} = formsApi;

export default formsApi;
