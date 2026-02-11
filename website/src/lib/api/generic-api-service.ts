// lib/api/client.ts
// Generic API Client with Axios

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Types
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

// API Client Configuration
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

    // Request interceptor - Add auth token
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

    // Response interceptor - Handle errors globally
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

  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  // Generic PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Upload file
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

// Generic CRUD Service Class
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

  // Get all items (with pagination)
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.client.get<PaginatedResponse<T>>(`${this.endpoint}${queryString}`);
  }

  // Get single item by ID
  async getById(id: string | number): Promise<T> {
    return this.client.get<T>(`${this.endpoint}/${id}`);
  }

  // Get single item by slug
  async getBySlug(slug: string): Promise<T> {
    return this.client.get<T>(`${this.endpoint}/slug/${slug}`);
  }

  // Create new item
  async create(data: Partial<T>): Promise<T> {
    return this.client.post<T>(this.endpoint, data);
  }

  // Update item
  async update(id: string | number, data: Partial<T>): Promise<T> {
    return this.client.put<T>(`${this.endpoint}/${id}`, data);
  }

  // Partial update
  async patch(id: string | number, data: Partial<T>): Promise<T> {
    return this.client.patch<T>(`${this.endpoint}/${id}`, data);
  }

  // Delete item
  async delete(id: string | number): Promise<void> {
    return this.client.delete<void>(`${this.endpoint}/${id}`);
  }

  // Bulk delete
  async bulkDelete(ids: (string | number)[]): Promise<void> {
    return this.client.post<void>(`${this.endpoint}/bulk-delete`, { ids });
  }

  // Search
  async search(query: string, params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryString({ ...params, search: query });
    return this.client.get<PaginatedResponse<T>>(`${this.endpoint}${queryString}`);
  }

  // Upload image for item
  async uploadImage(id: string | number, file: File): Promise<T> {
    return this.client.uploadFile<T>(`${this.endpoint}/${id}/image`, file, 'image');
  }

  // Build query string from params
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

// Create instances for public and admin APIs
export const publicApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  false
);

export const adminApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  true
);

// Export default
export default ApiClient;