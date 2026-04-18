import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Events', 'Event'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// ── Mock database ─────────────────────────────────────────────────────────────
// No backend Event entity provided yet.
// Ask backend team to create an Event entity (see gap report).
let eventsDB = [
  {
    id: 'event-1',
    title: { en: 'TEDx Damascus 2025', ar: 'TEDx دمشق 2025' },
    description: {
      en: 'Our flagship annual event celebrating ideas worth spreading across Syria and the Arab world.',
      ar: 'فعاليتنا السنوية الرئيسية للاحتفاء بالأفكار التي تستحق الانتشار في سوريا والعالم العربي.',
    },
    brief: {
      en: 'The biggest TEDx event in Damascus — 2025 edition.',
      ar: 'أكبر فعالية TEDx في دمشق — نسخة 2025.',
    },
    location: { en: 'Damascus Opera House', ar: 'دار الأوبرا بدمشق' },
    date: '2025-09-20',
    time: '18:00',
    starts_at: '2025-09-20T15:00:00Z',
    ends_at: '2025-09-20T22:00:00Z',
    status: 'upcoming',
    image: 'https://picsum.photos/seed/tedx-main/1200/800',
    gallery: [
      'https://picsum.photos/seed/stage-lights/1200/800',
      'https://picsum.photos/seed/conference-room/1200/800',
      'https://picsum.photos/seed/tedx-crowd/1200/800',
    ],
    speakers: [],
    max_attendees: 500,
    active: true,
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'event-2',
    title: { en: 'TEDx Damascus Salon — Tech Edition', ar: 'TEDx Damascus Salon — نسخة التقنية' },
    description: {
      en: 'A smaller, intimate gathering focused on technology and innovation in Syria.',
      ar: 'تجمع أصغر وأكثر حميمية يركز على التقنية والابتكار في سوريا.',
    },
    brief: {
      en: 'Intimate tech salon for innovators.',
      ar: 'صالون تقني حميمي للمبتكرين.',
    },
    location: { en: 'AltCity', ar: 'ألت سيتي' },
    date: '2025-06-14',
    time: '17:00',
    starts_at: '2025-06-14T14:00:00Z',
    ends_at: '2025-06-14T20:00:00Z',
    status: 'upcoming',
    image: 'https://picsum.photos/seed/altcity/1200/800',
    gallery: [
      'https://picsum.photos/seed/tech-talk/1200/800',
    ],
    speakers: [],
    max_attendees: 100,
    active: true,
    createdAt: '2025-02-15T08:00:00Z',
    updatedAt: '2025-02-15T08:00:00Z',
  },
  {
    id: 'event-3',
    title: { en: 'TEDx Damascus 2024 (Past)', ar: 'TEDx دمشق 2024 (منتهي)' },
    description: {
      en: 'Our 2024 flagship event featuring 12 speakers across science, art, and entrepreneurship.',
      ar: 'فعاليتنا الرئيسية لعام 2024 مع 12 متحدثاً في العلوم والفن وريادة الأعمال.',
    },
    brief: {
      en: 'A recap of our 2024 annual event.',
      ar: 'ملخص فعاليتنا السنوية لعام 2024.',
    },
    location: { en: 'Damascus University', ar: 'جامعة دمشق' },
    date: '2024-10-05',
    time: '17:00',
    starts_at: '2024-10-05T14:00:00Z',
    ends_at: '2024-10-05T21:00:00Z',
    status: 'completed',
    image: 'https://picsum.photos/seed/damascus-uni/1200/800',
    gallery: [
      'https://picsum.photos/seed/past-event-1/1200/800',
      'https://picsum.photos/seed/past-event-2/1200/800',
      'https://picsum.photos/seed/past-event-3/1200/800',
      'https://picsum.photos/seed/past-event-4/1200/800',
    ],
    speakers: [],
    max_attendees: 400,
    active: false,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-10-06T09:00:00Z',
  },
];

const eventsApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) {
        await wait();
        let items = [...eventsDB];

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (e) =>
              e.title?.en?.toLowerCase().includes(q) ||
              e.title?.ar?.toLowerCase().includes(q) ||
              e.location?.en?.toLowerCase().includes(q),
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
      providesTags: ['Events'],
    }),

    getEvent: builder.query({
      async queryFn(eventId) {
        await wait();
        const event = eventsDB.find((e) => e.id === eventId);
        if (!event) return { error: { status: 404, data: 'Event not found' } };
        return { data: event };
      },
      providesTags: ['Event'],
    }),

    createEvent: builder.mutation({
      async queryFn(data) {
        await wait();
        const newEvent = { ...data, id: `event-${Date.now()}`, createdAt: now(), updatedAt: now() };
        eventsDB = [newEvent, ...eventsDB];
        return { data: newEvent };
      },
      invalidatesTags: ['Events'],
    }),

    updateEvent: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const i = eventsDB.findIndex((e) => e.id === id);
        if (i < 0) return { error: { status: 404, data: 'Event not found' } };
        eventsDB[i] = { ...eventsDB[i], ...data, updatedAt: now() };
        return { data: eventsDB[i] };
      },
      invalidatesTags: ['Events', 'Event'],
    }),

    deleteEvent: builder.mutation({
      async queryFn(eventId) {
        await wait();
        const before = eventsDB.length;
        eventsDB = eventsDB.filter((e) => e.id !== eventId);
        if (before === eventsDB.length) return { error: { status: 404, data: 'Event not found' } };
        return { data: { message: 'Event deleted' } };
      },
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
