import axiosInstance from './axiosInstance';

const MOCK_USER = {
  id: 'admin-001',
  email: 'admin@tedxdamascus.com',
  role: 'admin',
  permissions: [],
  is_active: true
};

function createMockJwt(payload) {
  const enc = (str) =>
    btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const header = enc(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = enc(JSON.stringify(payload));
  return `${header}.${body}.mock`;
}

function mockLogin(email, password) {
  if (email !== 'admin@tedxdamascus.com' || password !== 'password') {
    throw { status: 401, message: 'Invalid credentials' };
  }
  const now = Math.floor(Date.now() / 1000);
  const access_token = createMockJwt({
    sub: MOCK_USER.id,
    email: MOCK_USER.email,
    role: MOCK_USER.role,
    permissions: MOCK_USER.permissions,
    iat: now,
    exp: now + 60 * 60 * 24 * 30
  });
  return { data: { access_token, refresh_token: 'mock-refresh-token', user: MOCK_USER } };
}

export async function login(email, password) {
  return mockLogin(email, password);

  // TODO: switch to real API when backend is ready — delete the mock above and uncomment:
  // const { data } = await axiosInstance.post('/auth/login', { email, password });
  // return data;
}
