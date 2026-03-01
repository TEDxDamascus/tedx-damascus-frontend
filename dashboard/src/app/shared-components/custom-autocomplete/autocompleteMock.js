import { normalizeOption } from './autocompleteUtils';

/** Mock data for autocomplete options. Replace with API call when backend is ready. */
const MOCK_SPEAKERS = [
  { id: '1', name: 'Dr. Ahmad Al-Hassan' },
  { id: '2', name: 'Layla Mansour' },
  { id: '3', name: 'Omar Khalil' },
  { id: '4', name: 'Sarah Jaber' },
  { id: '5', name: 'Karim Othman' }
];

const MOCK_VOLUNTEERS = [
  { id: 'v1', name: 'Nour Hassan' },
  { id: 'v2', name: 'Youssef Ibrahim' },
  { id: 'v3', name: 'Maya Al-Rashid' }
];

const MOCK_DELAY_MS = 300;

/**
 * Simulates API delay.
 */
function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch speaker options by query (mock).
 * When API is ready: replace body with e.g. axios.get(`/api/speakers/search?q=${query}`)
 * and map response to { id, label } or keep full objects.
 *
 * @param {string} query - Search string
 * @returns {Promise<Array<{id, label, ...}>>}
 */
export async function fetchSpeakerOptions(query) {
  await delay();
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const filtered = MOCK_SPEAKERS.filter((s) =>
    (s.name || '').toLowerCase().includes(q)
  );
  return filtered.map((s) => normalizeOption({ ...s, label: s.name }));
}

/**
 * Fetch volunteer options by query (mock).
 */
export async function fetchVolunteerOptions(query) {
  await delay();
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const filtered = MOCK_VOLUNTEERS.filter((v) =>
    (v.name || '').toLowerCase().includes(q)
  );
  return filtered.map((v) => normalizeOption({ ...v, label: v.name }));
}
