import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { User } from '../../types/auth.types';

interface UpdateUserRequest {
  name?: string;
  department?: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/users/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (body) => ({
        url: '/api/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/api/users',
      providesTags: ['User'],
    }),
  }),
});

export const { 
  useGetCurrentUserQuery, 
  useUpdateUserMutation,
  useGetUsersQuery 
} = userApi;
