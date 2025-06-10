import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workflow'],
  endpoints: (builder) => ({
    getWorkflows: builder.query<Workflow[], void>({
      query: () => '/api/workflows',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Workflow' as const, id })),
              { type: 'Workflow', id: 'LIST' },
            ]
          : [{ type: 'Workflow', id: 'LIST' }],
    }),
    getWorkflow: builder.query<Workflow, string>({
      query: (id) => `/api/workflows/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workflow', id }],
    }),
    createWorkflow: builder.mutation<Workflow, Partial<Workflow>>({
      query: (body) => ({
        url: '/api/workflows',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Workflow', id: 'LIST' }],
    }),
    updateWorkflow: builder.mutation<Workflow, { id: string; updates: Partial<Workflow> }>({
      query: ({ id, updates }) => ({
        url: `/api/workflows/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workflow', id }],
    }),
    deleteWorkflow: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/workflows/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Workflow', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useGetWorkflowQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
} = workflowApi;