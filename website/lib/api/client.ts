import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://api.tedxdamascus.sy';

export function getImageUrl(id: string | null | undefined | any): string {
  if (!id) return '/images/events/event-card.png';
  if (typeof id === 'string') {
    if (id.startsWith('http') || id.startsWith('/')) return id;
    return `${API_BASE_URL}/files/${id}`;
  }
  if (id && typeof id === 'object' && id.url) {
    return id.url;
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
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
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
  getQuestionAnswers: (questionId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/wall-cards/history/${questionId}/answers`, { params }),
  getCurrentAnswers: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/wall-cards/current/answers', { params }),
  submitAnswer: (answer: string) =>
    apiClient.post('/wall-cards/current/answers', { text: answer }),
};
