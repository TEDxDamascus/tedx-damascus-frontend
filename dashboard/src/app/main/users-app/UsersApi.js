import { apiService } from 'app/store/apiService';
import { buildDefaultPermissions } from './user-detail/models/UserModel';

export const addTagTypes = ['Users', 'User'];

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// ── Mock database ─────────────────────────────────────────────────────────────
let usersDB = [
  {
    id: '507f191e810c19729de860e1',
    name: 'Super Admin',
    email: 'superadmin@tedxdamascus.com',
    role: 'superadmin',
    permissions: buildDefaultPermissions(true),
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '507f191e810c19729de860e2',
    name: 'Ahmad Admin',
    email: 'ahmad@tedxdamascus.com',
    role: 'admin',
    permissions: {
      blogs: { view: true, create: true, edit: true, delete: false },
      users: { view: true, create: true, edit: true, delete: false },
      speakers: { view: true, create: true, edit: true, delete: false },
      forms: { view: true, create: true, edit: true, delete: false },
      events: { view: true, create: true, edit: true, delete: false },
      files: { view: true, create: true, edit: false, delete: false },
      images: { view: true, create: true, edit: false, delete: false },
    },
    status: 'active',
    createdAt: '2025-02-10T08:00:00Z',
    updatedAt: '2025-02-10T08:00:00Z',
  },
  {
    id: '507f191e810c19729de860e3',
    name: 'Layla Coordinator',
    email: 'layla@tedxdamascus.com',
    role: 'user',
    permissions: {
      blogs: { view: true, create: false, edit: false, delete: false },
      users: { view: true, create: false, edit: false, delete: false },
      speakers: { view: true, create: false, edit: false, delete: false },
      forms: { view: true, create: false, edit: false, delete: false },
      events: { view: true, create: false, edit: false, delete: false },
      files: { view: true, create: false, edit: false, delete: false },
      images: { view: true, create: false, edit: false, delete: false },
    },
    status: 'active',
    createdAt: '2025-03-15T12:00:00Z',
    updatedAt: '2025-03-15T12:00:00Z',
  },
  {
    id: '507f191e810c19729de860e4',
    name: 'Omar Volunteer',
    email: 'omar@tedxdamascus.com',
    role: 'user',
    permissions: buildDefaultPermissions(false),
    status: 'disabled',
    createdAt: '2025-03-20T09:00:00Z',
    updatedAt: '2025-04-01T11:00:00Z',
  },
];

/** Options for blog author autocomplete (search by name or email). */
export async function searchUserOptions(query) {
  await wait(80);
  const term = String(query || '')
    .trim()
    .toLowerCase();
  return usersDB
    .filter((u) => {
      if (!term) return true;
      return u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
    })
    .slice(0, 20)
    .map((u) => ({
      id: u.id,
      label: u.name || u.email || u.id,
    }));
}

const usersApi = apiService.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      async queryFn({ page = 1, pageSize = 10, search, sortBy, sortDir, status } = {}) {
        await wait();
        let items = [...usersDB];

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
          );
        }
        if (status) {
          items = items.filter((u) => u.status === status);
        }
        if (sortBy && items[0]?.[sortBy] !== undefined) {
          items.sort((a, b) => {
            const av = String(a[sortBy] ?? '');
            const bv = String(b[sortBy] ?? '');
            return sortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
          });
        }

        const start = (page - 1) * pageSize;
        const paged = items.slice(start, start + pageSize);
        return { data: { data: paged, total: items.length } };
      },
      providesTags: ['Users'],
    }),

    getUser: builder.query({
      async queryFn(userId) {
        await wait();
        const user = usersDB.find((u) => u.id === userId);
        if (!user) return { error: { status: 404, data: 'User not found' } };
        return { data: user };
      },
      providesTags: ['User'],
    }),

    createUser: builder.mutation({
      async queryFn(data) {
        await wait();
        const newUser = {
          ...data,
          id: Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
            Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          permissions: data.permissions ?? [],
          createdAt: now(),
          updatedAt: now(),
        };
        usersDB.push(newUser);
        return { data: newUser };
      },
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      async queryFn({ id, data }) {
        await wait();
        const i = usersDB.findIndex((u) => u.id === id);
        if (i < 0) return { error: { status: 404, data: 'User not found' } };
        usersDB[i] = { ...usersDB[i], ...data, updatedAt: now() };
        return { data: usersDB[i] };
      },
      invalidatesTags: ['Users', 'User'],
    }),

    bulkUpdateUsers: builder.mutation({
      async queryFn({ ids, data }) {
        await wait();
        ids.forEach((id) => {
          const i = usersDB.findIndex((u) => u.id === id);
          if (i >= 0) usersDB[i] = { ...usersDB[i], ...data, updatedAt: now() };
        });
        return { data: { updated: ids.length } };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useBulkUpdateUsersMutation,
} = usersApi;

export default usersApi;
