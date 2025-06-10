import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { LoginRequest, LoginResponse, MicrosoftLoginRequest, TokenValidationResponse } from '../../types/auth.types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    microsoftLogin: builder.mutation<LoginResponse, MicrosoftLoginRequest>({
      query: ({ email, name, microsoftId, accessToken }) => ({
        url: '/auth/microsoft',
        method: 'POST',
        body: { email, name, microsoftId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    validateToken: builder.query<TokenValidationResponse, void>({
      query: () => '/auth/validate',
      providesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useMicrosoftLoginMutation,
  useLogoutMutation,
  useValidateTokenQuery,
  useRefreshTokenMutation,
} = authApi;