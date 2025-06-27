import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";
import {
  LoginRequest,
  LoginResponse,
  MicrosoftLoginRequest,
  AuthRequest,
} from "../../types/auth.types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // FDRW login endpoint - sends Microsoft Graph token to backend
    fdrwLogin: builder.mutation<LoginResponse, AuthRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    // Refresh session token
    refreshSessionToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/newsessiontoken",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    // Legacy endpoints (keep for compatibility if needed)
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/loginbyusername",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    microsoftLogin: builder.mutation<LoginResponse, MicrosoftLoginRequest>({
      query: ({ accessToken }) => ({
        url: "/auth/login",
        method: "POST",
        body: { token: accessToken },
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useFdrwLoginMutation,
  useRefreshSessionTokenMutation,
  useLoginMutation,
  useMicrosoftLoginMutation,
  useLogoutMutation,
} = authApi;
