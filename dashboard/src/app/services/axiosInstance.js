import axios from 'axios';
import { tokenService } from './tokenService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  refreshQueue = [];
}

function forceLogout() {
  tokenService.clearTokens();
  window.dispatchEvent(new Event('auth:logout'));
}

function normalizeError(error) {
  return {
    status: error.response?.status,
    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
    raw: error,
  };
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefresh } = data.data;
      tokenService.setTokens({ access_token, refresh_token: newRefresh });
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      processQueue(null, access_token);
      original.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Only force logout when the backend explicitly rejects the refresh token (401/403).
      // Network errors, 404s, or mock-token failures should not end the session.
      const status = refreshError?.response?.status;
      if (status === 401 || status === 403) {
        forceLogout();
      }
      return Promise.reject(normalizeError(refreshError));
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
