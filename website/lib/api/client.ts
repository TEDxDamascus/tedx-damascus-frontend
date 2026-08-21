import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://api.tedxdamascus.sy';

/** The backend's object storage serves plain http:// with no TLS on that port, so the browser blocks it as mixed content on our https:// pages. Route it through weserv's HTTPS image proxy until the storage itself is served over TLS. */
function toSecureImageUrl(url: string): string {
  if (!url.startsWith('http://')) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url.slice('http://'.length))}`;
}

export function getImageUrl(id: string | null | undefined | any): string {
  if (!id) return '/images/events/event-card.png';
  if (typeof id === 'string') {
    if (id.startsWith('http') || id.startsWith('/')) return toSecureImageUrl(id);
    return `${API_BASE_URL}/files/${id}`;
  }
  if (id && typeof id === 'object' && id.url) {
    return toSecureImageUrl(id.url);
  }
  return '/images/events/event-card.png';
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // api.tedxdamascus.sy has repeatedly shown plain TLS connection
        // resets under load. A network-level failure (no `error.response` at
        // all — reset/timeout/DNS, as opposed to a real 4xx/5xx) during a
        // build-time generateStaticParams call silently drops that page from
        // the whole static export rather than crashing anything, so retry a
        // couple of times before giving up.
        const config = error.config as (AxiosRequestConfig & { __retryCount?: number }) | undefined;
        const isNetworkError = !error.response;
        if (config && isNetworkError && (config.__retryCount ?? 0) < 2) {
          config.__retryCount = (config.__retryCount ?? 0) + 1;
          await new Promise((resolve) => setTimeout(resolve, 500 * config.__retryCount!));
          return this.client.request(config);
        }

        // This is a public, unauthenticated site with no admin/login route of
        // its own — several backend endpoints (see e.g. the organizer detail
        // route, and /wall-cards/questions) wrongly require auth for what
        // should be public reads. A hard `window.location.href` redirect here
        // used to hijack the whole page on any 401, even though callers
        // already handle the rejection gracefully (empty-state fallbacks).
        // Just clear the stale token and let each caller's own .catch decide
        // what to show.
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>) {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

export const speakersApi = {
  getAll: (params?: { featured?: boolean; limit?: number }) =>
    apiClient.get('/speakers', { params }),
  getBySlug: (slug: string, locale: string) =>
    apiClient.get(`/speakers/${slug}?locale=${locale}`),
  create: (data: any) =>
    apiClient.post('/speakers', data),
  update: (id: string, data: any) =>
    apiClient.put(`/speakers/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/speakers/${id}`),
};

export const eventsApi = {
  getAll: (params?: { status?: string; upcoming?: boolean; limit?: number }) =>
    apiClient.get('/events', { params }),
  getBySlug: (slug: string, locale: string) =>
    apiClient.get(`/events/${slug}?locale=${locale}`),
  getById: (id: string, locale: string) =>
    apiClient.get(`/events/${id}?locale=${locale}`),
  create: (data: any) =>
    apiClient.post('/events', data),
  update: (id: string, data: any) =>
    apiClient.put(`/events/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/events/${id}`),
};

export const blogsApi = {
  getAll: (params?: any) =>
    apiClient.get('/blogs', { params }),
  getBySlug: (slug: string, locale: string) =>
    apiClient.get(`/blogs/${slug}?locale=${locale}`),
  create: (data: any) =>
    apiClient.post('/blogs', data),
  update: (id: string, data: any) =>
    apiClient.put(`/blogs/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/blogs/${id}`),
};

export interface TeamMemberApiData {
  _id: string;
  name: { en: string; ar: string };
  image?: { url: string } | string;
  year?: number;
  social_link?: string[];
  bio?: { en: string; ar: string };
  createdAt: string;
  updatedAt: string;
}

export const teamApi = {
  getAll: () => apiClient.get<{ success: boolean; data: TeamMemberApiData[] }>('/team'),
};

export const formsApi = {
  getForm: (type: 'volunteer' | 'speaker') =>
    apiClient.get(`/forms/${type}`),
  submitForm: (type: string, data: any) =>
    apiClient.post(`/forms/${type}/submit`, data),
  getSubmissions: (formId: string) =>
    apiClient.get(`/forms/${formId}/submissions`),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () =>
    apiClient.post('/auth/logout'),
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};

export const newsletterApi = {
  subscribe: (email: string) =>
    apiClient.post('/newsletter/subscribe', { email }),
};

export const wallApi = {
  getCurrent: () =>
    apiClient.get('/wall-cards/current'),
  getAll: (params?: { limit?: number }) =>
    apiClient.get('/wall-cards', { params }),
  getById: (id: string) =>
    apiClient.get(`/wall-cards/${id}`),
  getQuestions: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/wall-cards/questions', { params }),
  getQuestionById: (id: string) =>
    apiClient.get(`/wall-cards/history/${id}`),
  getQuestionAnswers: (questionId: string, params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get(`/wall-cards/history/${questionId}/answers`, { params }),
  getCurrentAnswers: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/wall-cards/current/answers', { params }),
  submitAnswer: (answer: string) =>
    apiClient.post('/wall-cards/current/answers', { text: answer }),
};
