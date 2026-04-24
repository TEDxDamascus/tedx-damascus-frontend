import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Forms', 'Form', 'FormSubmissions'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const newId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Mock databases (aligned with backend FormTemplate / FormSubmission entities) ──

let formsDB = [
  {
    id: 'form-1',
    createdByAdminId: 'user-1',
    targetRole: 'Speaker',
    status: 'Published',
    name: { en: 'Speaker Application 2025', ar: 'طلب متحدث 2025' },
    description: {
      en: 'Apply to speak at TEDx Damascus 2025.',
      ar: 'تقدم للتحدث في TEDx Damascus 2025.',
    },
    publishedAt: '2025-03-10T12:00:00Z',
    starts_at: '2025-03-10T00:00:00Z',
    ends_at: '2025-07-31T23:59:59Z',
    expires_at: null,
    max_submissions: 200,
    slug: { en: 'speaker-application-2025', ar: 'طلب-متحدث-2025' },
    shareable_url: {
      en: 'https://tedxdamascus.com/apply/speaker-application-2025',
      ar: 'https://tedxdamascus.com/ar/apply/طلب-متحدث-2025',
    },
    questions: [
      {
        id: 'q-1',
        orderIndex: 0,
        type: 'short_text',
        title: { en: 'Full Name', ar: 'الاسم الكامل' },
        helpText: { en: 'Your official full name', ar: 'اسمك الرسمي الكامل' },
        isRequired: true,
        config: {},
        options: [],
      },
      {
        id: 'q-2',
        orderIndex: 1,
        type: 'short_text',
        title: { en: 'Talk Title', ar: 'عنوان المحادثة' },
        helpText: {
          en: 'A short, compelling title for your talk',
          ar: 'عنوان قصير وجذاب لمحادثتك',
        },
        isRequired: true,
        config: {},
        options: [],
      },
      {
        id: 'q-3',
        orderIndex: 2,
        type: 'long_text',
        title: { en: 'Talk Summary', ar: 'ملخص المحادثة' },
        helpText: {
          en: 'Describe your talk idea in 200–400 words',
          ar: 'صف فكرة محادثتك في 200–400 كلمة',
        },
        isRequired: true,
        config: { maxLength: 2000 },
        options: [],
      },
      {
        id: 'q-4',
        orderIndex: 3,
        type: 'radio',
        title: {
          en: 'Have you spoken at a TEDx event before?',
          ar: 'هل تحدثت في فعالية TEDx من قبل؟',
        },
        helpText: { en: '', ar: '' },
        isRequired: true,
        config: {},
        options: [
          { id: 'opt-1', orderIndex: 0, label: { en: 'Yes', ar: 'نعم' } },
          { id: 'opt-2', orderIndex: 1, label: { en: 'No', ar: 'لا' } },
        ],
      },
    ],
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-10T12:00:00Z',
  },
  {
    id: 'form-2',
    createdByAdminId: 'user-1',
    targetRole: 'Attender',
    status: 'Draft',
    name: { en: 'Attendee Registration', ar: 'تسجيل الحضور' },
    description: {
      en: 'Register to attend TEDx Damascus 2025.',
      ar: 'سجل لحضور TEDx Damascus 2025.',
    },
    publishedAt: null,
    starts_at: null,
    ends_at: null,
    expires_at: null,
    max_submissions: 500,
    slug: { en: 'attendee-registration-2025', ar: 'تسجيل-الحضور-2025' },
    shareable_url: { en: '', ar: '' },
    questions: [
      {
        id: 'q-5',
        orderIndex: 0,
        type: 'short_text',
        title: { en: 'Full Name', ar: 'الاسم الكامل' },
        helpText: { en: '', ar: '' },
        isRequired: true,
        config: {},
        options: [],
      },
      {
        id: 'q-6',
        orderIndex: 1,
        type: 'short_text',
        title: { en: 'Email Address', ar: 'البريد الإلكتروني' },
        helpText: { en: '', ar: '' },
        isRequired: true,
        config: {},
        options: [],
      },
    ],
    createdAt: '2025-04-01T08:00:00Z',
    updatedAt: '2025-04-01T08:00:00Z',
  },
  {
    id: 'form-3',
    createdByAdminId: 'user-1',
    targetRole: 'Volunteer',
    status: 'Draft',
    name: { en: 'Question Types Showcase', ar: 'عرض أنواع الأسئلة' },
    description: {
      en: 'A demo form with one question of every available type.',
      ar: 'نموذج توضيحي يحتوي على سؤال من كل نوع متاح.',
    },
    publishedAt: null,
    starts_at: null,
    ends_at: null,
    expires_at: null,
    max_submissions: null,
    slug: { en: 'question-types-showcase', ar: 'عرض-انواع-الاسئلة' },
    shareable_url: { en: '', ar: '' },
    questions: [
      // ── TEXT & INPUT ──────────────────────────────────────────────────────────
      {
        id: 'sq-1',
        orderIndex: 0,
        type: 'section',
        title: { en: 'Text & Input Fields', ar: 'حقول النص والإدخال' },
        helpText: { en: 'All plain-text input types', ar: 'جميع أنواع إدخال النص' },
        isRequired: false,
        config: {},
        options: [],
      },
      {
        id: 'sq-2',
        orderIndex: 1,
        type: 'short_text',
        title: { en: 'Full Name', ar: 'الاسم الكامل' },
        helpText: {
          en: 'Your official full name as on your ID',
          ar: 'اسمك الرسمي الكامل كما في هويتك',
        },
        isRequired: true,
        config: { maxLength: 120 },
        options: [],
      },
      {
        id: 'sq-3',
        orderIndex: 2,
        type: 'long_text',
        title: { en: 'Tell us about yourself', ar: 'أخبرنا عن نفسك' },
        helpText: {
          en: 'Write a short bio (200–400 words)',
          ar: 'اكتب سيرة ذاتية قصيرة (200–400 كلمة)',
        },
        isRequired: true,
        config: { maxLength: 2000, rows: 5 },
        options: [],
      },
      {
        id: 'sq-4',
        orderIndex: 3,
        type: 'number',
        title: { en: 'Years of Experience', ar: 'سنوات الخبرة' },
        helpText: {
          en: 'How many years of professional experience do you have?',
          ar: 'كم سنة خبرة مهنية لديك؟',
        },
        isRequired: false,
        config: { min: 0, max: 50, step: 1 },
        options: [],
      },
      {
        id: 'sq-5',
        orderIndex: 4,
        type: 'email',
        title: { en: 'Email Address', ar: 'البريد الإلكتروني' },
        helpText: { en: 'We will send your confirmation here', ar: 'سنرسل تأكيدك إلى هذا العنوان' },
        isRequired: true,
        config: {},
        options: [],
      },
      {
        id: 'sq-6',
        orderIndex: 5,
        type: 'phone',
        title: { en: 'Phone Number', ar: 'رقم الهاتف' },
        helpText: { en: 'Include country code', ar: 'أدخل رمز الدولة' },
        isRequired: false,
        config: { country_code_required: true },
        options: [],
      },
      {
        id: 'sq-7',
        orderIndex: 6,
        type: 'url',
        title: { en: 'Personal Website or Portfolio', ar: 'الموقع الشخصي أو المحفظة' },
        helpText: {
          en: 'Link to your work (LinkedIn, GitHub, etc.)',
          ar: 'رابط لأعمالك (LinkedIn، GitHub، إلخ)',
        },
        isRequired: false,
        config: {},
        options: [],
      },
      // ── CHOICE ───────────────────────────────────────────────────────────────
      {
        id: 'sq-8',
        orderIndex: 7,
        type: 'section',
        title: { en: 'Choice Questions', ar: 'أسئلة الاختيار' },
        helpText: {
          en: 'Single and multiple selection types',
          ar: 'أنواع الاختيار الفردي والمتعدد',
        },
        isRequired: false,
        config: {},
        options: [],
      },
      {
        id: 'sq-9',
        orderIndex: 8,
        type: 'radio',
        title: { en: 'Have you volunteered before?', ar: 'هل تطوعت من قبل؟' },
        helpText: {
          en: 'Pick the option that best describes you',
          ar: 'اختر الخيار الذي يصفك بشكل أفضل',
        },
        isRequired: true,
        config: {},
        options: [
          { id: 'opt-r1', orderIndex: 0, label: { en: 'Yes, extensively', ar: 'نعم، بشكل مكثف' } },
          { id: 'opt-r2', orderIndex: 1, label: { en: 'Yes, a little', ar: 'نعم، قليلاً' } },
          { id: 'opt-r3', orderIndex: 2, label: { en: 'No', ar: 'لا' } },
        ],
      },
      {
        id: 'sq-10',
        orderIndex: 9,
        type: 'checkbox',
        title: { en: 'Which days can you volunteer?', ar: 'في أي أيام يمكنك التطوع؟' },
        helpText: { en: 'Select all that apply', ar: 'اختر كل ما ينطبق' },
        isRequired: true,
        config: { allowOther: false },
        options: [
          { id: 'opt-c1', orderIndex: 0, label: { en: 'Friday', ar: 'الجمعة' } },
          { id: 'opt-c2', orderIndex: 1, label: { en: 'Saturday', ar: 'السبت' } },
          { id: 'opt-c3', orderIndex: 2, label: { en: 'Sunday', ar: 'الأحد' } },
        ],
      },
      {
        id: 'sq-11',
        orderIndex: 10,
        type: 'select',
        title: { en: 'Preferred volunteer role', ar: 'الدور التطوعي المفضل' },
        helpText: { en: 'Choose one role', ar: 'اختر دوراً واحداً' },
        isRequired: true,
        config: {},
        options: [
          { id: 'opt-s1', orderIndex: 0, label: { en: 'Registration Desk', ar: 'طاولة التسجيل' } },
          { id: 'opt-s2', orderIndex: 1, label: { en: 'Stage Management', ar: 'إدارة المسرح' } },
          {
            id: 'opt-s3',
            orderIndex: 2,
            label: { en: 'Social Media', ar: 'وسائل التواصل الاجتماعي' },
          },
          { id: 'opt-s4', orderIndex: 3, label: { en: 'Photography', ar: 'التصوير' } },
        ],
      },
      {
        id: 'sq-12',
        orderIndex: 11,
        type: 'multi_select',
        title: { en: 'Languages you speak', ar: 'اللغات التي تتحدثها' },
        helpText: {
          en: 'Select all languages you are comfortable using',
          ar: 'اختر جميع اللغات التي تجيدها',
        },
        isRequired: false,
        config: {},
        options: [
          { id: 'opt-m1', orderIndex: 0, label: { en: 'Arabic', ar: 'العربية' } },
          { id: 'opt-m2', orderIndex: 1, label: { en: 'English', ar: 'الإنجليزية' } },
          { id: 'opt-m3', orderIndex: 2, label: { en: 'French', ar: 'الفرنسية' } },
          { id: 'opt-m4', orderIndex: 3, label: { en: 'German', ar: 'الألمانية' } },
        ],
      },
      {
        id: 'sq-13',
        orderIndex: 12,
        type: 'yes_no',
        title: {
          en: 'Are you available the full event day?',
          ar: 'هل أنت متاح طوال يوم الفعالية؟',
        },
        helpText: {
          en: 'The event runs from 9 AM to 8 PM',
          ar: 'تمتد الفعالية من 9 صباحاً حتى 8 مساءً',
        },
        isRequired: true,
        config: { default_value: null },
        options: [],
      },
      // ── DATE & FILE ───────────────────────────────────────────────────────────
      {
        id: 'sq-14',
        orderIndex: 13,
        type: 'section',
        title: { en: 'Date & File Fields', ar: 'حقول التاريخ والملفات' },
        helpText: { en: '', ar: '' },
        isRequired: false,
        config: {},
        options: [],
      },
      {
        id: 'sq-15',
        orderIndex: 14,
        type: 'date',
        title: { en: 'Date of Birth', ar: 'تاريخ الميلاد' },
        helpText: {
          en: 'Must be 18 or older to volunteer',
          ar: 'يجب أن يكون عمرك 18 عاماً أو أكثر للتطوع',
        },
        isRequired: true,
        config: { includeTime: false },
        options: [],
      },
      {
        id: 'sq-16',
        orderIndex: 15,
        type: 'date_range',
        title: { en: 'Availability Window', ar: 'نافذة التوفر' },
        helpText: { en: 'When are you generally available?', ar: 'متى تكون متاحاً بشكل عام؟' },
        isRequired: false,
        config: { min_date: '', max_date: '' },
        options: [],
      },
      {
        id: 'sq-17',
        orderIndex: 16,
        type: 'file_upload',
        title: { en: 'Upload your CV', ar: 'ارفع سيرتك الذاتية' },
        helpText: {
          en: 'PDF or Word document, max 5 MB',
          ar: 'ملف PDF أو Word، بحد أقصى 5 ميغابايت',
        },
        isRequired: false,
        config: { allowed_types: ['pdf', 'docx'], max_size_mb: 5, max_files: 1 },
        options: [],
      },
      // ── OTHER ─────────────────────────────────────────────────────────────────
      {
        id: 'sq-18',
        orderIndex: 17,
        type: 'section',
        title: { en: 'Other', ar: 'أخرى' },
        helpText: { en: 'Rating and visual dividers', ar: 'التقييم والفواصل المرئية' },
        isRequired: false,
        config: {},
        options: [],
      },
      {
        id: 'sq-19',
        orderIndex: 18,
        type: 'rating',
        title: { en: 'How did you hear about TEDx Damascus?', ar: 'كيف سمعت عن TEDx Damascus؟' },
        helpText: {
          en: 'Rate your familiarity from 1 (just heard) to 5 (long-time follower)',
          ar: 'قيّم معرفتك من 1 (سمعت للتو) إلى 5 (متابع منذ فترة طويلة)',
        },
        isRequired: false,
        config: {
          min: 1,
          max: 5,
          step: 1,
          min_label: { en: 'Just heard of it', ar: 'سمعت عنه للتو' },
          max_label: { en: 'Long-time follower', ar: 'متابع منذ فترة طويلة' },
        },
        options: [],
      },
    ],
    createdAt: '2025-04-02T10:00:00Z',
    updatedAt: '2025-04-02T10:00:00Z',
  },
];

// FormSubmission mock data
let submissionsDB = [
  {
    id: 'sub-1',
    formTemplateId: 'form-1',
    userId: 'ext-user-101',
    status: 'submitted',
    submittedAt: '2025-03-15T10:30:00Z',
    answers: [
      { questionId: 'q-1', value: 'Nour Al-Rashid' },
      { questionId: 'q-2', value: 'Rebuilding Through Art' },
      { questionId: 'q-3', value: 'Art has always been a medium for healing and rebuilding...' },
      { questionId: 'q-4', value: 'opt-2' },
    ],
    createdAt: '2025-03-15T10:25:00Z',
    updatedAt: '2025-03-15T10:30:00Z',
  },
  {
    id: 'sub-2',
    formTemplateId: 'form-1',
    userId: 'ext-user-102',
    status: 'submitted',
    submittedAt: '2025-03-18T14:00:00Z',
    answers: [
      { questionId: 'q-1', value: 'Rami Barakat' },
      { questionId: 'q-2', value: 'The Future of Syrian Tech Startups' },
      { questionId: 'q-3', value: 'Syria is witnessing a quiet startup revolution...' },
      { questionId: 'q-4', value: 'opt-1' },
    ],
    createdAt: '2025-03-18T13:50:00Z',
    updatedAt: '2025-03-18T14:00:00Z',
  },
];

// ── Helper ─────────────────────────────────────────────────────────────────────
function findForm(id) {
  return formsDB.find((f) => f.id === id);
}

const formsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    // ── FormTemplate CRUD ──────────────────────────────────────────────────────
    getForms: builder.query({
      async queryFn() {
        await wait();
        // Return a shallow copy so RTK Query never freezes formsDB itself
        return { data: { data: [...formsDB] } };
      },
      providesTags: ['Forms'],
    }),

    getForm: builder.query({
      async queryFn(formId) {
        await wait();
        const form = findForm(formId);
        if (!form) return { error: { status: 404, data: 'Form not found' } };
        // Shallow-copy so the cached object doesn't share identity with formsDB entries
        return { data: { data: { ...form, questions: [...form.questions] } } };
      },
      providesTags: ['Form'],
    }),

    createForm: builder.mutation({
      async queryFn(data) {
        await wait();
        const newForm = {
          ...data,
          id: newId(),
          status: 'Draft',
          publishedAt: null,
          questions: [],
          createdAt: now(),
          updatedAt: now(),
        };
        formsDB = [newForm, ...formsDB];
        return { data: { data: newForm } };
      },
      invalidatesTags: ['Forms'],
    }),

    updateForm: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        let updated;
        formsDB = formsDB.map((f) => {
          if (f.id !== id) return f;
          updated = { ...f, ...data, updatedAt: now() };
          return updated;
        });
        if (!updated) return { error: { status: 404, data: 'Form not found' } };
        return { data: { data: updated } };
      },
      invalidatesTags: ['Forms', 'Form'],
    }),

    deleteForm: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = formsDB.length;
        formsDB = formsDB.filter((f) => f.id !== id);
        if (before === formsDB.length) return { error: { status: 404, data: 'Form not found' } };
        return { data: { message: 'Form deleted' } };
      },
      invalidatesTags: ['Forms'],
    }),

    // ── Question sub-resource ─────────────────────────────────────────────────
    addQuestion: builder.mutation({
      async queryFn({ formId, data }) {
        await wait();
        const form = findForm(formId);
        if (!form) return { error: { status: 404, data: 'Form not found' } };
        const newQuestion = { ...data, id: newId() };
        formsDB = formsDB.map((f) =>
          f.id === formId
            ? { ...f, questions: [...f.questions, newQuestion], updatedAt: now() }
            : f,
        );
        return { data: { data: newQuestion } };
      },
      invalidatesTags: ['Form'],
    }),

    updateQuestion: builder.mutation({
      async queryFn({ formId, questionId, data }) {
        await wait();
        const form = findForm(formId);
        if (!form) return { error: { status: 404, data: 'Form not found' } };
        let updatedQuestion;
        formsDB = formsDB.map((f) => {
          if (f.id !== formId) return f;
          const questions = f.questions.map((q) => {
            if (q.id !== questionId) return q;
            updatedQuestion = { ...q, ...data };
            return updatedQuestion;
          });
          return { ...f, questions, updatedAt: now() };
        });
        return { data: { data: updatedQuestion } };
      },
      invalidatesTags: ['Form'],
    }),

    removeQuestion: builder.mutation({
      async queryFn({ formId, questionId }) {
        await wait();
        if (!findForm(formId)) return { error: { status: 404, data: 'Form not found' } };
        formsDB = formsDB.map((f) =>
          f.id === formId
            ? { ...f, questions: f.questions.filter((q) => q.id !== questionId), updatedAt: now() }
            : f,
        );
        return { data: { message: 'Question removed' } };
      },
      invalidatesTags: ['Form'],
    }),

    // ── Publish / Unpublish ───────────────────────────────────────────────────
    publishForm: builder.mutation({
      async queryFn(formId) {
        await wait();
        let updated;
        formsDB = formsDB.map((f) => {
          if (f.id !== formId) return f;
          updated = {
            ...f,
            status: 'Published',
            publishedAt: f.publishedAt ?? now(),
            updatedAt: now(),
          };
          return updated;
        });
        if (!updated) return { error: { status: 404, data: 'Form not found' } };
        return { data: { data: updated } };
      },
      invalidatesTags: ['Forms', 'Form'],
    }),

    unpublishForm: builder.mutation({
      async queryFn(formId) {
        await wait();
        let updated;
        formsDB = formsDB.map((f) => {
          if (f.id !== formId) return f;
          updated = { ...f, status: 'Draft', updatedAt: now() };
          return updated;
        });
        if (!updated) return { error: { status: 404, data: 'Form not found' } };
        return { data: { data: updated } };
      },
      invalidatesTags: ['Forms', 'Form'],
    }),

    // ── Submissions ───────────────────────────────────────────────────────────
    getFormSubmissions: builder.query({
      async queryFn({ formId, page = 1, pageSize = 10 }) {
        await wait();
        const items = submissionsDB.filter((s) => s.formTemplateId === formId);
        const start = (page - 1) * pageSize;
        const paged = items.slice(start, start + pageSize);
        return {
          data: {
            data: { items: paged, total: items.length, page, pageSize },
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
