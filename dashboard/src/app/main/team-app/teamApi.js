import { apiService } from 'app/store/apiService';

export const addTagTypes = ['TeamMembers', 'TeamMember'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

let teamDB = [
    {
        id: 'member-1',
        name: { en: 'Nour', ar: 'نور' },
        role: { en: 'Frontend Developer', ar: 'مطورة واجهات أماميّة' },
        department: 'IT',
        photo: 'https://picsum.photos/seed/it/800/1000',
        bio: { en: 'React Expert.', ar: 'خبير ريآكت' },
        linkedin: 'https://linkedin.com/in/nour',
        active: true,
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: 'member-2',
        name: { en: 'Sami', ar: 'سامي' },
        role: { en: 'Logistics Manager', ar: 'مدير العمليات اللوجستية' },
        department: 'Logistics',
        photo: 'https://picsum.photos/seed/logistics/800/1000',
        bio: { en: 'Operations expert.', ar: 'خبير في إدارة العمليات.' },
        linkedin: 'https://linkedin.com/in/sami',
        active: true,
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: 'member-3',
        name: { en: 'Lila', ar: 'ليلى' },
        role: { en: 'Content Strategist', ar: 'مسؤولة صناعة المحتوى' },
        department: 'Content',
        photo: 'https://picsum.photos/seed/content/800/1000',
        bio: { en: 'Storytelling specialist.', ar: 'متخصصة في سرد القصص.' },
        linkedin: 'https://linkedin.com/in/lila',
        active: true,
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: 'member-4',
        name: { en: 'Omar', ar: 'عمر' },
        role: { en: 'Graphic Designer', ar: 'مصمم غرافيك' },
        department: 'Design',
        photo: 'https://picsum.photos/seed/design/800/1000',
        bio: { en: 'Visual branding expert.', ar: 'خبير في الهوية البصرية والمطبوعات.' },
        linkedin: 'https://linkedin.com/in/omar',
        active: true,
        createdAt: now(),
        updatedAt: now(),
    }
];

export async function searchTeamOptions(query) {
    await wait(80);
    const term = String(query || '').trim().toLowerCase();
    return teamDB
        .filter((m) => {
            if (!term) return true;
            return (
                m.name?.en?.toLowerCase().includes(term) ||
                m.name?.ar?.toLowerCase().includes(term) ||
                m.department?.toLowerCase().includes(term)
            );
        })
        .slice(0, 20)
        .map((m) => ({ id: m.id, label: m.name?.en || m.name?.ar || m.id }));
}

const teamApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
    endpoints: (builder) => ({
        getTeam: builder.query({
            async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir } = {}) {
                await wait();
                let items = [...teamDB];

                if (search) {
                    const q = search.toLowerCase();
                    items = items.filter(
                        (m) =>
                            m.name?.en?.toLowerCase().includes(q) ||
                            m.name?.ar?.toLowerCase().includes(q) ||
                            m.department?.toLowerCase().includes(q)
                    );
                }

                if (sortBy) {
                    items.sort((a, b) => {
                        const av = a[sortBy] || '';
                        const bv = b[sortBy] || '';
                        return sortDir === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
                    });
                }

                const start = (page - 1) * pageSize;
                const paged = items.slice(start, start + pageSize);
                return { data: { data: { items: paged, total: items.length } } };
            },
            providesTags: ['TeamMembers'],
        }),

        getTeamMember: builder.query({
            async queryFn(memberId) {
                await wait();
                const member = teamDB.find((m) => m.id === memberId);
                if (!member) return { error: { status: 404, data: 'Member not found' } };
                return { data: member };
            },
            providesTags: ['TeamMember'],
        }),

        createTeamMember: builder.mutation({
            async queryFn(data) {
                await wait();
                const newMember = { ...data, id: `member-${Date.now()}`, createdAt: now(), updatedAt: now() };
                teamDB = [newMember, ...teamDB];
                return { data: newMember };
            },
            invalidatesTags: ['TeamMembers'],
        }),

        updateTeamMember: builder.mutation({
            async queryFn({ id, data }) {
                await wait();
                const i = teamDB.findIndex((m) => m.id === id);
                if (i < 0) return { error: { status: 404, data: 'Member not found' } };
                teamDB[i] = { ...teamDB[i], ...data, updatedAt: now() };
                return { data: teamDB[i] };
            },
            invalidatesTags: ['TeamMembers', 'TeamMember'],
        }),

        deleteTeamMember: builder.mutation({
            async queryFn(memberId) {
                await wait();
                const before = teamDB.length;
                teamDB = teamDB.filter((m) => m.id !== memberId);
                if (before === teamDB.length)
                    return { error: { status: 404, data: 'Member not found' } };
                return { data: { message: 'Member deleted' } };
            },
            invalidatesTags: ['TeamMembers'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTeamQuery,
    useGetTeamMemberQuery,
    useCreateTeamMemberMutation,
    useUpdateTeamMemberMutation,
    useDeleteTeamMemberMutation,
} = teamApi;

export default teamApi;