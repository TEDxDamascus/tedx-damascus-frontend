import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../services/axiosInstance';

const axiosBaseQuery = () => async ({ url, method, data, params, headers }) => {
  try {
    const result = await axiosInstance({ url, method, data, params, headers });
    return { data: result.data };
  } catch (error) {
    return {
      error: {
        status: error.status,
        data: error.message
      }
    };
  }
};

export const apiService = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  reducerPath: 'apiService'
});

export default apiService;
