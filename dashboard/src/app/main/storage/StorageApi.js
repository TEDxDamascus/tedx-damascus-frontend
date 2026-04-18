import { apiService } from 'app/store';

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// ── Mock database (Image entity — backend references Image model in Blog but schema not yet provided) ──
// Ask backend team to share the Image entity schema.
let mediaDB = [
  {
    id: 'img-1',
    url: 'https://picsum.photos/seed/tedx-main/1200/800',
    basename: 'tedx-event-main.jpg',
    filename: 'tedx-event-main.jpg',
    size: 245000,
    mimetype: 'image/jpeg',
    alt: 'TEDx Event Main',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'img-2',
    url: 'https://picsum.photos/seed/speaker-portrait/800/1000',
    basename: 'speaker-portrait.jpg',
    filename: 'speaker-portrait.jpg',
    size: 189000,
    mimetype: 'image/jpeg',
    alt: 'Speaker Portrait',
    createdAt: '2025-02-05T11:00:00Z',
    updatedAt: '2025-02-05T11:00:00Z',
  },
  {
    id: 'img-3',
    url: 'https://picsum.photos/seed/damascus-city/1200/800',
    basename: 'damascus-skyline.jpg',
    filename: 'damascus-skyline.jpg',
    size: 320000,
    mimetype: 'image/jpeg',
    alt: 'Damascus Skyline',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'img-4',
    url: 'https://picsum.photos/seed/stage-lights/1200/800',
    basename: 'stage-setup.jpg',
    filename: 'stage-setup.jpg',
    size: 275000,
    mimetype: 'image/jpeg',
    alt: 'Stage Setup',
    createdAt: '2025-02-12T14:00:00Z',
    updatedAt: '2025-02-12T14:00:00Z',
  },
  {
    id: 'img-5',
    url: 'https://picsum.photos/seed/audience-hall/1200/800',
    basename: 'audience-view.jpg',
    filename: 'audience-view.jpg',
    size: 298000,
    mimetype: 'image/jpeg',
    alt: 'Audience View',
    createdAt: '2025-02-14T16:00:00Z',
    updatedAt: '2025-02-14T16:00:00Z',
  },
  {
    id: 'img-6',
    url: 'https://picsum.photos/seed/microphone-stage/800/600',
    basename: 'microphone-stage.jpg',
    filename: 'microphone-stage.jpg',
    size: 156000,
    mimetype: 'image/jpeg',
    alt: 'Microphone on Stage',
    createdAt: '2025-02-16T10:00:00Z',
    updatedAt: '2025-02-16T10:00:00Z',
  },
  {
    id: 'img-7',
    url: 'https://picsum.photos/seed/conference-room/1200/800',
    basename: 'conference-room.jpg',
    filename: 'conference-room.jpg',
    size: 312000,
    mimetype: 'image/jpeg',
    alt: 'Conference Room',
    createdAt: '2025-02-18T09:00:00Z',
    updatedAt: '2025-02-18T09:00:00Z',
  },
  {
    id: 'img-8',
    url: 'https://picsum.photos/seed/networking-event/1200/800',
    basename: 'networking-event.jpg',
    filename: 'networking-event.jpg',
    size: 287000,
    mimetype: 'image/jpeg',
    alt: 'Networking Event',
    createdAt: '2025-02-20T14:00:00Z',
    updatedAt: '2025-02-20T14:00:00Z',
  },
  {
    id: 'img-9',
    url: 'https://picsum.photos/seed/tech-innovation/1200/800',
    basename: 'tech-innovation.jpg',
    filename: 'tech-innovation.jpg',
    size: 234000,
    mimetype: 'image/jpeg',
    alt: 'Tech Innovation',
    createdAt: '2025-02-22T11:00:00Z',
    updatedAt: '2025-02-22T11:00:00Z',
  },
  {
    id: 'img-10',
    url: 'https://picsum.photos/seed/creative-workspace/1200/800',
    basename: 'creative-workspace.jpg',
    filename: 'creative-workspace.jpg',
    size: 268000,
    mimetype: 'image/jpeg',
    alt: 'Creative Workspace',
    createdAt: '2025-02-24T09:00:00Z',
    updatedAt: '2025-02-24T09:00:00Z',
  },
  {
    id: 'img-11',
    url: 'https://picsum.photos/seed/street-art/1200/800',
    basename: 'street-art.jpg',
    filename: 'street-art.jpg',
    size: 301000,
    mimetype: 'image/jpeg',
    alt: 'Street Art',
    createdAt: '2025-02-25T13:00:00Z',
    updatedAt: '2025-02-25T13:00:00Z',
  },
  {
    id: 'img-12',
    url: 'https://picsum.photos/seed/panel-discussion/1200/800',
    basename: 'panel-discussion.jpg',
    filename: 'panel-discussion.jpg',
    size: 255000,
    mimetype: 'image/jpeg',
    alt: 'Panel Discussion',
    createdAt: '2025-02-26T15:00:00Z',
    updatedAt: '2025-02-26T15:00:00Z',
  },
  {
    id: 'img-13',
    url: 'https://picsum.photos/seed/woman-speaker/800/1000',
    basename: 'woman-speaker.jpg',
    filename: 'woman-speaker.jpg',
    size: 178000,
    mimetype: 'image/jpeg',
    alt: 'Woman Speaker',
    createdAt: '2025-02-27T10:00:00Z',
    updatedAt: '2025-02-27T10:00:00Z',
  },
  {
    id: 'img-14',
    url: 'https://picsum.photos/seed/laptop-desk/1200/800',
    basename: 'laptop-desk.jpg',
    filename: 'laptop-desk.jpg',
    size: 192000,
    mimetype: 'image/jpeg',
    alt: 'Laptop on Desk',
    createdAt: '2025-02-28T09:00:00Z',
    updatedAt: '2025-02-28T09:00:00Z',
  },
  {
    id: 'img-15',
    url: 'https://picsum.photos/seed/crowd-cheering/1200/800',
    basename: 'crowd-cheering.jpg',
    filename: 'crowd-cheering.jpg',
    size: 345000,
    mimetype: 'image/jpeg',
    alt: 'Crowd Cheering',
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-03-01T08:00:00Z',
  },
];

const storageApi = apiService.enhanceEndpoints({ addTagTypes: ['StorageMedia'] }).injectEndpoints({
  endpoints: (builder) => ({
    getMediaItems: builder.query({
      async queryFn({ page = 1, limit = 20 } = {}) {
        await wait();
        const start = (page - 1) * limit;
        const items = mediaDB.slice(start, start + limit);
        const totalPages = Math.ceil(mediaDB.length / limit);
        return { data: { data: { items, total: mediaDB.length, totalPages, page } } };
      },
      providesTags: ['StorageMedia'],
    }),

    uploadMedia: builder.mutation({
      async queryFn(formData) {
        await wait(400);
        // Simulate upload — create a mock entry from the file name
        const file = formData instanceof FormData ? formData.get('file') : null;
        const filename = file?.name ?? `upload-${Date.now()}.jpg`;
        const size = file?.size ?? 100000;
        const seed = Date.now();
        const newItem = {
          id: `img-${seed}`,
          url: `https://picsum.photos/seed/${seed}/800/600`,
          basename: filename,
          filename,
          size,
          mimetype: file?.type ?? 'image/jpeg',
          alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          createdAt: now(),
          updatedAt: now(),
        };
        mediaDB = [newItem, ...mediaDB];
        return { data: { data: newItem } };
      },
      invalidatesTags: ['StorageMedia'],
    }),

    deleteMedia: builder.mutation({
      async queryFn(id) {
        await wait();
        const before = mediaDB.length;
        mediaDB = mediaDB.filter((m) => m.id !== id);
        if (before === mediaDB.length)
          return { error: { status: 404, data: 'Media not found' } };
        return { data: { message: 'Media deleted' } };
      },
      invalidatesTags: ['StorageMedia'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMediaItemsQuery, useUploadMediaMutation, useDeleteMediaMutation } = storageApi;
export default storageApi;
