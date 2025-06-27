import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// FDRW backend URL - update this to match your FDRW backend deployment
const baseUrl =
  process.env.REACT_APP_API_URL ||
  "https://hkg.efadrin.biz:8453/efadrin/v3.0/fdrw-api/api";

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Base API with re-auth logic
export const baseQueryWithReauth: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, logout user
    const { logout } = await import("../slices/authSlice");
    api.dispatch(logout());
  }

  return result;
};
