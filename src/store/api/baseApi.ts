import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const baseQuery = fetchBaseQuery({
  baseUrl,  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Base API with re-auth logic
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired, logout user
    const { logout } = await import('../slices/authSlice');
    api.dispatch(logout());
  }
  
  return result;
};