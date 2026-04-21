import { apiService } from 'app/store/apiService';

export const addTagTypes = ['WallQuestions', 'WallQuestion', 'WallBannedWords'];

const now = () => new Date().toISOString();
const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

let mockQuestions = [
  {
    id: 'wall-q-1',
    title: { en: 'What idea would you share on a TEDx stage?', ar: 'ما الفكرة التي تشاركها على منصة TEDx؟' },
    status: 'published',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-15T14:30:00Z',
  },
  {
    id: 'wall-q-2',
    title: { en: 'Draft question (not on the site yet)', ar: 'سؤال مسودة' },
    status: 'draft',
    createdAt: '2025-04-01T09:00:00Z',
    updatedAt: '2025-04-01T09:00:00Z',
  },
];

let mockAnswers = [
  {
    id: 'wall-a-1',
    questionId: 'wall-q-1',
    body: 'I would talk about community-led education in Damascus.',
    status: 'approved',
    isFeatured: true,
    createdAt: '2025-02-10T11:00:00Z',
  },
  {
    id: 'wall-a-2',
    questionId: 'wall-q-1',
    body: 'Pending answer waiting for moderation.',
    status: 'pending',
    isFeatured: false,
    createdAt: '2025-02-20T16:00:00Z',
  },
  {
    id: 'wall-a-3',
    questionId: 'wall-q-1',
    body: 'This was rejected by an admin.',
    status: 'rejected',
    isFeatured: false,
    createdAt: '2025-02-18T09:00:00Z',
  },
];

let mockBannedWords = [
  { id: 'bw-1', word: 'spam', lang: 'en' },
  { id: 'bw-2', word: 'إساءة', lang: 'ar' },
];

function matchId(item, id) {
  return String(item.id) === String(id);
}

function answersForQuestion(questionId) {
  return mockAnswers.filter((a) => a.questionId === questionId);
}

const wallApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getWallQuestions: builder.query({
      async queryFn({ page = 1, limit = 20, status } = {}) {
        await wait();
        let filtered = mockQuestions.filter((q) => {
          if (status && q.status !== status) return false;
          return true;
        });
        const start = (page - 1) * limit;
        const items = filtered.slice(start, start + limit);
        return {
          data: {
            success: true,
            statusCode: 200,
            message: 'Wall questions',
            data: { items, total: filtered.length, page, limit },
          },
        };
      },
      providesTags: ['WallQuestions'],
    }),

    getWallQuestion: builder.query({
      async queryFn(questionId) {
        await wait();
        const q = mockQuestions.find((item) => matchId(item, questionId));
        if (!q) return { error: { status: 404, data: 'Question not found' } };
        const answers = answersForQuestion(q.id);
        return {
          data: {
            success: true,
            statusCode: 200,
            data: { ...q, answers },
          },
        };
      },
      providesTags: (result, error, questionId) => [{ type: 'WallQuestion', id: questionId }],
    }),

    createWallQuestion: builder.mutation({
      async queryFn(data) {
        await wait();
        const newQ = {
          title: data.title || { en: '', ar: '' },
          status: data.status === 'published' ? 'published' : 'draft',
          id: `wall-q-${Date.now()}`,
          createdAt: now(),
          updatedAt: now(),
        };
        mockQuestions = [newQ, ...mockQuestions];
        return {
          data: { success: true, statusCode: 201, message: 'Created', data: newQ },
        };
      },
      invalidatesTags: ['WallQuestions'],
    }),

    updateWallQuestion: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const index = mockQuestions.findIndex((item) => matchId(item, id));
        if (index < 0) return { error: { status: 404, data: 'Question not found' } };
        const prev = mockQuestions[index];
        const updated = {
          ...prev,
          ...data,
          title: data.title ?? prev.title,
          status: data.status ?? prev.status,
          updatedAt: now(),
        };
        mockQuestions[index] = updated;
        return {
          data: { success: true, statusCode: 200, message: 'Updated', data: updated },
        };
      },
      invalidatesTags: (result, error, { id }) => ['WallQuestions', { type: 'WallQuestion', id }],
    }),

    deleteWallQuestion: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mockQuestions.length;
        mockQuestions = mockQuestions.filter((item) => !matchId(item, id));
        mockAnswers = mockAnswers.filter((a) => a.questionId !== String(id));
        if (before === mockQuestions.length) return { error: { status: 404, data: 'Not found' } };
        return { data: { success: true, statusCode: 200, message: 'Deleted' } };
      },
      invalidatesTags: ['WallQuestions'],
    }),

    createWallAnswer: builder.mutation({
      async queryFn({ questionId, body }) {
        await wait();
        const q = mockQuestions.find((item) => matchId(item, questionId));
        if (!q) return { error: { status: 404, data: 'Question not found' } };
        const answer = {
          id: `wall-a-${Date.now()}`,
          questionId: q.id,
          body: String(body || '').trim(),
          status: 'pending',
          isFeatured: false,
          createdAt: now(),
        };
        if (!answer.body) return { error: { status: 400, data: 'Body required' } };
        mockAnswers = [answer, ...mockAnswers];
        return {
          data: { success: true, statusCode: 201, data: answer },
        };
      },
      invalidatesTags: (r, e, { questionId }) => [
        'WallQuestions',
        { type: 'WallQuestion', id: questionId },
      ],
    }),

    updateWallAnswerStatus: builder.mutation({
      async queryFn({ questionId, answerId, status }) {
        await wait();
        const idx = mockAnswers.findIndex((a) => matchId(a, answerId) && a.questionId === questionId);
        if (idx < 0) return { error: { status: 404, data: 'Answer not found' } };
        mockAnswers[idx] = { ...mockAnswers[idx], status };
        return { data: { success: true, data: mockAnswers[idx] } };
      },
      invalidatesTags: (r, e, { questionId }) => [{ type: 'WallQuestion', id: questionId }],
    }),

    setWallAnswerFeatured: builder.mutation({
      async queryFn({ questionId, answerId }) {
        await wait();
        const q = mockQuestions.find((item) => matchId(item, questionId));
        if (!q) return { error: { status: 404, data: 'Question not found' } };
        mockAnswers = mockAnswers.map((a) => {
          if (a.questionId !== q.id) return a;
          if (matchId(a, answerId)) {
            if (a.status !== 'approved') return a;
            return { ...a, isFeatured: true };
          }
          return { ...a, isFeatured: false };
        });
        return { data: { success: true } };
      },
      invalidatesTags: (r, e, { questionId }) => [{ type: 'WallQuestion', id: questionId }],
    }),

    deleteWallAnswer: builder.mutation({
      async queryFn({ questionId, answerId }) {
        await wait();
        const before = mockAnswers.length;
        mockAnswers = mockAnswers.filter((a) => !(matchId(a, answerId) && a.questionId === questionId));
        if (before === mockAnswers.length) return { error: { status: 404, data: 'Not found' } };
        return { data: { success: true } };
      },
      invalidatesTags: (r, e, { questionId }) => [{ type: 'WallQuestion', id: questionId }],
    }),

    getWallBannedWords: builder.query({
      async queryFn() {
        await wait();
        return {
          data: {
            success: true,
            data: { items: [...mockBannedWords] },
          },
        };
      },
      providesTags: ['WallBannedWords'],
    }),

    addWallBannedWord: builder.mutation({
      async queryFn({ word, lang }) {
        await wait();
        const w = String(word || '').trim();
        if (!w) return { error: { status: 400, data: 'Word required' } };
        const allowed = ['en', 'ar', 'all'];
        const l = allowed.includes(lang) ? lang : 'all';
        const row = { id: `bw-${Date.now()}`, word: w, lang: l };
        mockBannedWords = [row, ...mockBannedWords];
        return { data: { success: true, data: row } };
      },
      invalidatesTags: ['WallBannedWords'],
    }),

    deleteWallBannedWord: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mockBannedWords.length;
        mockBannedWords = mockBannedWords.filter((b) => !matchId(b, id));
        if (before === mockBannedWords.length) return { error: { status: 404, data: 'Not found' } };
        return { data: { success: true } };
      },
      invalidatesTags: ['WallBannedWords'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWallQuestionsQuery,
  useGetWallQuestionQuery,
  useCreateWallQuestionMutation,
  useUpdateWallQuestionMutation,
  useDeleteWallQuestionMutation,
  useCreateWallAnswerMutation,
  useUpdateWallAnswerStatusMutation,
  useSetWallAnswerFeaturedMutation,
  useDeleteWallAnswerMutation,
  useGetWallBannedWordsQuery,
  useAddWallBannedWordMutation,
  useDeleteWallBannedWordMutation,
} = wallApi;

export default wallApi;
