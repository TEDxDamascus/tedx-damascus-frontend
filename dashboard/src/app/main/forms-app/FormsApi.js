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
        const questions = (f.questions ?? []).map((q) => ({ ...q, id: q._id || q.id }));
        return { data: { ...f, id: f._id || f.id, questions } };
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

    // POST response returns the full updated form — use it to patch the cache directly
    // so questions appear immediately without a separate GET.
    addQuestion: builder.mutation({
      query: ({ formId, data }) => ({
        url: `/forms/${formId}/questions`,
        method: 'POST',
        data,
      }),
      async onQueryStarted({ formId }, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const f = response?.data ?? response;
          if (Array.isArray(f?.questions)) {
            dispatch(
              apiService.util.updateQueryData('getForm', formId, (draft) => {
                draft.data.questions = f.questions.map((q) => ({
                  ...q,
                  id: q._id || q.id,
                }));
              }),
            );
          }
        } catch {
          // mutation error is already handled in useFormBuilder
        }
      },
    }),

    // Optimistic update: patch the question in cache immediately, undo on failure.
    updateQuestion: builder.mutation({
      query: ({ formId, questionId, data }) => ({
        url: `/forms/${formId}/questions/${questionId}`,
        method: 'PATCH',
        data,
      }),
      async onQueryStarted({ formId, questionId, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiService.util.updateQueryData('getForm', formId, (draft) => {
            const q = (draft.data.questions ?? []).find((q) => q.id === questionId);
            if (q) Object.assign(q, data);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // Optimistic update: remove from cache immediately, undo on failure.
    removeQuestion: builder.mutation({
      query: ({ formId, questionId }) => ({
        url: `/forms/${formId}/questions/${questionId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ formId, questionId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiService.util.updateQueryData('getForm', formId, (draft) => {
            if (draft.data.questions) {
              draft.data.questions = draft.data.questions.filter((q) => q.id !== questionId);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
