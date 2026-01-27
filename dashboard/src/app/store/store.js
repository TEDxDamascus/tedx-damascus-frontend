import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import apiService from './apiService';
import userReducer from '../auth/store/userSlice';

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware)
});

setupListeners(store.dispatch);
export default store;
