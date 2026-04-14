import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Speakers', 'Speaker'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// ── Mock database ─────────────────────────────────────────────────────────────
let speakersDB = [
  {
    id: 'speaker-1',
    name: { en: 'Dr. Ahmad Al-Hassan', ar: 'د. أحمد الحسن' },
    bio: {
      en: 'Pioneering AI researcher and entrepreneur focused on democratizing AI across the Middle East.',
      ar: 'باحث رائد في مجال الذكاء الاصطناعي وريادي يركز على تعميم الذكاء الاصطناعي في الشرق الأوسط.',
    },
    description: {
      en: 'Dr. Ahmad leads the AI research lab at Damascus Tech Innovation Hub, where his team builds open-source tools for Arabic NLP.',
      ar: 'يقود د. أحمد مختبر أبحاث الذكاء الاصطناعي في مركز دمشق للابتكار التقني.',
    },
    speaker_image: 'https://picsum.photos/seed/speaker-portrait/800/1000',
    social_links: [
      'https://linkedin.com/in/ahmadhassan',
      'https://twitter.com/ahmadhassan',
    ],
    gallery: [
      'https://picsum.photos/seed/tedx-main/1200/800',
      'https://picsum.photos/seed/stage-lights/1200/800',
    ],
    video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    company: 'Damascus Tech Innovation Hub',
    email: 'ahmad.hassan@example.com',
    phone: '+963 11 2234567',
    featured: true,
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'speaker-2',
    name: { en: 'Layla Mansour', ar: 'ليلى منصور' },
    bio: {
      en: 'Social entrepreneur and founder of multiple education initiatives empowering Syrian youth.',
      ar: 'رائدة اجتماعية ومؤسسة مبادرات تعليمية متعددة لتمكين الشباب السوري.',
    },
    description: {
      en: 'Layla founded EdTech Syria in 2018 and has since reached over 50,000 students across the country.',
      ar: 'أسست ليلى EdTech Syria عام 2018 ووصلت منذ ذلك الحين إلى أكثر من 50,000 طالب.',
    },
    speaker_image: 'https://picsum.photos/seed/woman-speaker/800/1000',
    social_links: [
      'https://linkedin.com/in/laylam',
      'https://facebook.com/laylam',
    ],
    gallery: [
      'https://picsum.photos/seed/conference-room/1200/800',
    ],
    video_link: '',
    company: 'EdTech Syria',
    email: 'layla.mansour@example.com',
    phone: '+963 11 3345678',
    featured: true,
    active: true,
    createdAt: '2025-01-16T11:30:00Z',
    updatedAt: '2025-01-16T11:30:00Z',
  },
  {
    id: 'speaker-3',
    name: { en: 'Omar Khalil', ar: 'عمر خليل' },
    bio: {
      en: 'Award-winning architect reimagining urban spaces with sustainable, culturally-rooted designs.',
      ar: 'مهندس معماري حائز على جوائز يعيد تصور المساحات الحضرية بتصاميم مستدامة.',
    },
    description: {
      en: 'Omar\'s studio has completed over 30 projects across Syria and Lebanon, blending heritage aesthetics with modern engineering.',
      ar: 'أنجز مكتب عمر أكثر من 30 مشروعاً في سوريا ولبنان.',
    },
    speaker_image: '',
    social_links: [
      'https://linkedin.com/in/omarkhalil',
      'https://heritagearchitecture.com',
    ],
    gallery: [],
    video_link: '',
    company: 'Heritage Architecture Studio',
    email: 'omar.khalil@example.com',
    phone: '+963 11 4456789',
    featured: false,
    active: true,
    createdAt: '2025-01-17T09:15:00Z',
    updatedAt: '2025-01-17T09:15:00Z',
  },
  {
    id: 'speaker-4',
    name: { en: 'Sarah Jaber', ar: 'سارة جابر' },
    bio: {
      en: 'Neuroscientist exploring the intersection of brain science, mental health, and cultural well-being.',
      ar: 'عالمة أعصاب تستكشف تقاطع علم الدماغ والصحة النفسية والرفاهية الثقافية.',
    },
    description: {
      en: 'Dr. Sarah\'s research at Damascus University focuses on trauma recovery in conflict-affected populations.',
      ar: 'تركز أبحاث د. سارة في جامعة دمشق على التعافي من الصدمات في المجتمعات المتأثرة بالنزاعات.',
    },
    speaker_image: '',
    social_links: [
      'https://linkedin.com/in/sarahjaber',
    ],
    gallery: [],
    video_link: '',
    company: 'Damascus University',
    email: 'sarah.jaber@example.com',
    phone: '+963 11 5567890',
    featured: true,
    active: true,
    createdAt: '2025-01-18T14:20:00Z',
    updatedAt: '2025-01-18T14:20:00Z',
  },
  {
    id: 'speaker-5',
    name: { en: 'Karim Othman', ar: 'كريم عثمان' },
    bio: {
      en: 'Documentary filmmaker and storyteller capturing untold narratives from across Syria.',
      ar: 'صانع أفلام وثائقية وراوي قصص يوثق روايات غير مسموعة من أنحاء سوريا.',
    },
    description: {
      en: 'Karim\'s documentary "Fragments of Damascus" won the 2023 Arab Cinema Award and has been screened in 18 countries.',
      ar: 'فاز فيلم كريم الوثائقي "شظايا دمشق" بجائزة السينما العربية 2023.',
    },
    speaker_image: '',
    social_links: [
      'https://twitter.com/karimothman',
      'https://syrianstories.com',
    ],
    gallery: [],
    video_link: '',
    company: 'Syrian Stories Productions',
    email: 'karim.othman@example.com',
    phone: '+963 11 6678901',
    featured: false,
    active: true,
    createdAt: '2025-01-19T16:45:00Z',
    updatedAt: '2025-01-19T16:45:00Z',
  },
];

export async function searchSpeakerOptions(query) {
  await wait(80);
  const term = String(query || '').trim().toLowerCase();
  return speakersDB
    .filter((s) => {
      if (!term) return true;
      return (
        s.name?.en?.toLowerCase().includes(term) ||
        s.name?.ar?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.company?.toLowerCase().includes(term)
      );
    })
    .slice(0, 20)
    .map((s) => ({ id: s.id, label: s.name?.en || s.name?.ar || s.id }));
}

const speakersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getSpeakers: builder.query({
      async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) {
        await wait();
        let items = [...speakersDB];

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (s) =>
              s.name?.en?.toLowerCase().includes(q) ||
              s.name?.ar?.toLowerCase().includes(q) ||
              s.email?.toLowerCase().includes(q) ||
              s.company?.toLowerCase().includes(q),
          );
        }
        if (sortBy) {
          items.sort((a, b) => {
            const av = String(a[sortBy] ?? '');
            const bv = String(b[sortBy] ?? '');
            return sortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
          });
        }

        const start = (page - 1) * pageSize;
        const paged = items.slice(start, start + pageSize);
        return { data: { data: { items: paged, total: items.length } } };
      },
      providesTags: ['Speakers'],
    }),

    getSpeaker: builder.query({
      async queryFn(speakerId) {
        await wait();
        const speaker = speakersDB.find((s) => s.id === speakerId);
        if (!speaker) return { error: { status: 404, data: 'Speaker not found' } };
        return { data: speaker };
      },
      providesTags: ['Speaker'],
    }),

    createSpeaker: builder.mutation({
      async queryFn(data) {
        await wait();
        const newSpeaker = { ...data, id: `speaker-${Date.now()}`, createdAt: now(), updatedAt: now() };
        speakersDB = [newSpeaker, ...speakersDB];
        return { data: newSpeaker };
      },
      invalidatesTags: ['Speakers'],
    }),

    updateSpeaker: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const i = speakersDB.findIndex((s) => s.id === id);
        if (i < 0) return { error: { status: 404, data: 'Speaker not found' } };
        speakersDB[i] = { ...speakersDB[i], ...data, updatedAt: now() };
        return { data: speakersDB[i] };
      },
      invalidatesTags: ['Speakers', 'Speaker'],
    }),

    deleteSpeaker: builder.mutation({
      async queryFn(speakerId) {
        await wait();
        const before = speakersDB.length;
        speakersDB = speakersDB.filter((s) => s.id !== speakerId);
        if (before === speakersDB.length)
          return { error: { status: 404, data: 'Speaker not found' } };
        return { data: { message: 'Speaker deleted' } };
      },
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
