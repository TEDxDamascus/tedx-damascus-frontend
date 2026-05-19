import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Organizers', 'Organizer'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// ── Mock database for Organizers ─────────────────────────────────────────────
let organizersDB = [
  {
    id: 'organizer-1',
    name: { en: 'Syrian Tech Network', ar: 'شبكة التقنية السورية' },
  role: 'Primary Logistics & Tech Coordination',
    description: {
      en: 'Leading organization in fostering digital transformation and networking for Syrian professionals.',
      ar: 'منظمة رائدة في تعزيز التحول الرقمي والتشبيك للمحترفين السوريين.',
    },
    logo: 'https://picsum.photos/seed/org-logo-1/400/400',
    website: 'https://syriantech.org',
    social_links: ['https://linkedin.com/company/syriantech', 'https://facebook.com/syriantech'],
    contact_person: 'Mazen Al-Shami',
    email: 'info@syriantech.org',
    phone: '+963 11 1112222',
    active: true,
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  {
    id: 'organizer-2',
    name: { en: 'Innovation Hub Damascus', ar: 'مركز دمشق للابتكار' },
role: 'Primary Logistics & Tech Coordination',
    description: {
      en: 'A creative space dedicated to supporting startups and cultural events in the heart of Damascus.',
      ar: 'مساحة إبداعية مخصصة لدعم الشركات الناشئة والفعاليات الثقافية في قلب دمشق.',
    },
    logo: 'https://picsum.photos/seed/org-logo-2/400/400',
    website: 'https://damascushub.com',
    social_links: ['https://instagram.com/damascushub'],
    contact_person: 'Lina Jaber',
    email: 'events@damascushub.com',
    phone: '+963 11 3334444',
    active: true,
    createdAt: '2025-01-05T10:30:00Z',
    updatedAt: '2025-01-05T10:30:00Z',
  },
];

export async function searchOrganizerOptions(query) {
  await wait(80);
  const term = String(query || '')
    .trim()
    .toLowerCase();
  return organizersDB
    .filter((o) => {
      if (!term) return true;
      return (
        o.name?.en?.toLowerCase().includes(term) ||
        o.name?.ar?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term) ||
        o.contact_person?.toLowerCase().includes(term)
      );
    })
    .slice(0, 20)
    .map((o) => ({ id: o.id, label: o.name?.en || o.name?.ar || o.id }));
}

const organizersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getOrganizers: builder.query({
      async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) {
        await wait();
        let items = [...organizersDB];

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (o) =>
              o.name?.en?.toLowerCase().includes(q) ||
              o.name?.ar?.toLowerCase().includes(q) ||
              o.email?.toLowerCase().includes(q) ||
              o.contact_person?.toLowerCase().includes(q),
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
      providesTags: ['Organizers'],
    }),

    getOrganizer: builder.query({
      async queryFn(organizerId) {
        await wait();
        const organizer = organizersDB.find((o) => o.id === organizerId);
        if (!organizer) return { error: { status: 404, data: 'Organizer not found' } };
        return { data: organizer };
      },
      providesTags: ['Organizer'],
    }),

    createOrganizer: builder.mutation({
      async queryFn(data) {
        await wait();
        const newOrganizer = {
          ...data,
          id: `organizer-${Date.now()}`,
          createdAt: now(),
          updatedAt: now(),
        };
        organizersDB = [newOrganizer, ...organizersDB];
        return { data: newOrganizer };
      },
      invalidatesTags: ['Organizers'],
    }),

    updateOrganizer: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const i = organizersDB.findIndex((o) => o.id === id);
        if (i < 0) return { error: { status: 404, data: 'Organizer not found' } };
        organizersDB[i] = { ...organizersDB[i], ...data, updatedAt: now() };
        return { data: organizersDB[i] };
      },
      invalidatesTags: ['Organizers', 'Organizer'],
    }),

    deleteOrganizer: builder.mutation({
      async queryFn(organizerId) {
        await wait();
        const before = organizersDB.length;
        organizersDB = organizersDB.filter((o) => o.id !== organizerId);
        if (before === organizersDB.length)
          return { error: { status: 404, data: 'Organizer not found' } };
        return { data: { message: 'Organizer deleted' } };
      },
      invalidatesTags: ['Organizers'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganizersQuery,
  useGetOrganizerQuery,
  useCreateOrganizerMutation,
  useUpdateOrganizerMutation,
  useDeleteOrganizerMutation,
} = organizersApi;

export default organizersApi;