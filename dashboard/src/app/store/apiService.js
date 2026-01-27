import { createApi } from '@reduxjs/toolkit/query/react';
import Axios from 'axios';

const axiosBaseQuery = ({ baseUrl } = {}) =>
  async ({ url, method, data, params }) => {
    try {
      const token = localStorage.getItem('tedx_token');
      const result = await Axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message
        }
      };
    }
  };

export const apiService = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api'
  }),
  endpoints: () => ({}),
  reducerPath: 'apiService'
});

export default apiService;
