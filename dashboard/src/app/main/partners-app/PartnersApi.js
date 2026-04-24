import { apiService } from 'app/store/apiService';

export const addTagTypes = ['Partners', 'Partner'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

let partnersDB = [
  {
    id: 'partner-1',
    title: { en: 'Syrian Telecom', ar: 'السورية للاتصالات' },
    email: 'contact@syriantelecom.sy',
    phone: '+963 11 9988',
    image: 'https://picsum.photos/seed/telecom/400/400',
    description: {
      en: 'The leading telecommunications provider in Syria.',
      ar: 'المزود الرائد لخدمات الاتصالات في سوريا.',
    },
    type: 'Diamond Sponsor',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'partner-2',
    title: { en: 'Cham Bank', ar: 'بنك الشام' },
    email: 'info@chambank.sy',
    phone: '+963 11 2233',
    image: 'https://picsum.photos/seed/bank/400/400',
    description: {
      en: 'First Islamic bank in Syria providing modern financial solutions.',
      ar: 'أول مصرف إسلامي في سوريا يقدم حلولاً مالية حديثة.',
    },
    type: 'Gold Sponsor',
    createdAt: '2025-01-16T11:30:00Z',
    updatedAt: '2025-01-16T11:30:00Z',
  },
  {
    id: 'partner-3',
    title: { en: 'Damascus University', ar: 'جامعة دمشق' },
    email: 'admin@damasuniv.edu.sy',
    phone: '+963 11 4455',
    image: 'https://picsum.photos/seed/university/400/400',
    description: {
      en: 'The oldest and largest university in Syria, our academic partner.',
      ar: 'أقدم وأكبر جامعة في سوريا، شريكنا الأكاديمي.',
    },
    type: 'Academic Partner',
    createdAt: '2025-01-17T09:15:00Z',
    updatedAt: '2025-01-17T09:15:00Z',
  },
];

const partnersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query({
      async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) {
        await wait();
        let items = [...partnersDB];

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (p) =>
              p.title?.en?.toLowerCase().includes(q) ||
              p.title?.ar?.toLowerCase().includes(q) ||
              p.email?.toLowerCase().includes(q) ||
              p.type?.toLowerCase().includes(q),
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
      providesTags: ['Partners'],
    }),

    getPartner: builder.query({
      async queryFn(partnerId) {
        await wait();
        const partner = partnersDB.find((p) => p.id === partnerId);
        if (!partner) return { error: { status: 404, data: 'Partner not found' } };
        return { data: partner };
      },
      providesTags: ['Partner'],
    }),

    createPartner: builder.mutation({
      async queryFn(data) {
        await wait();
        const newPartner = {
          ...data,
          id: `partner-${Date.now()}`,
          createdAt: now(),
          updatedAt: now(),
        };
        partnersDB = [newPartner, ...partnersDB];
        return { data: newPartner };
      },
      invalidatesTags: ['Partners'],
    }),

    updatePartner: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const i = partnersDB.findIndex((p) => p.id === id);
        if (i < 0) return { error: { status: 404, data: 'Partner not found' } };
        partnersDB[i] = { ...partnersDB[i], ...data, updatedAt: now() };
        return { data: partnersDB[i] };
      },
      invalidatesTags: ['Partners', 'Partner'],
    }),

    deletePartner: builder.mutation({
      async queryFn(partnerId) {
        await wait();
        const before = partnersDB.length;
        partnersDB = partnersDB.filter((p) => p.id !== partnerId);
        if (before === partnersDB.length)
          return { error: { status: 404, data: 'Partner not found' } };
        return { data: { message: 'Partner deleted' } };
      },
      invalidatesTags: ['Partners'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPartnersQuery,
  useGetPartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnersApi;

export default partnersApi;
