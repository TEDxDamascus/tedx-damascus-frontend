// lib/api/client.ts
// Generic API Client with Axios

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, isAuthenticated: boolean = false) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config) => {
        if (isAuthenticated) {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && isAuthenticated) {
          // Unauthorized - redirect to login
          this.handleUnauthorized();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  private formatError(error: any): ApiError {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export class CrudService<T> {
  protected client: ApiClient;
  protected endpoint: string;

  constructor(endpoint: string, isAuthenticated: boolean = false) {
    this.endpoint = endpoint;
    this.client = new ApiClient(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      isAuthenticated
    );
  }

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.client.get<PaginatedResponse<T>>(`${this.endpoint}${queryString}`);
  }

  async getById(id: string | number): Promise<T> {
    return this.client.get<T>(`${this.endpoint}/${id}`);
  }

  async getBySlug(slug: string): Promise<T> {
    return this.client.get<T>(`${this.endpoint}/slug/${slug}`);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.client.post<T>(this.endpoint, data);
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    return this.client.put<T>(`${this.endpoint}/${id}`, data);
  }

  async patch(id: string | number, data: Partial<T>): Promise<T> {
    return this.client.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string | number): Promise<void> {
    return this.client.delete<void>(`${this.endpoint}/${id}`);
  }

  async bulkDelete(ids: (string | number)[]): Promise<void> {
    return this.client.post<void>(`${this.endpoint}/bulk-delete`, { ids });
  }

  async search(query: string, params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryString({ ...params, search: query });
    return this.client.get<PaginatedResponse<T>>(`${this.endpoint}${queryString}`);
  }

  async uploadImage(id: string | number, file: File): Promise<T> {
    return this.client.uploadFile<T>(`${this.endpoint}/${id}/image`, file, 'image');
  }

  private buildQueryString(params: any): string {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        query.append(key, params[key].toString());
      }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
  }
}

export const publicApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  false
);

export const adminApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  true
);

export default ApiClient;