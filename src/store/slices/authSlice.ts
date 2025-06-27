import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStatus, AuthStatusConst } from "../../utils/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  msalAccount: any; // For MSAL account object
  isLoading: boolean;
  error: string | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  msalAccount: null,
  isLoading: false,
  error: null,
  status: AuthStatusConst.initial,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = AuthStatusConst.failed;
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.status = AuthStatusConst.loggedIn;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    setMsalAccount: (state, action: PayloadAction<any>) => {
      state.msalAccount = action.payload;
    },
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.status = AuthStatusConst.loggedIn;
      localStorage.setItem("authToken", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.msalAccount = null;
      state.isLoading = false;
      state.error = null;
      state.status = AuthStatusConst.initial;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUser,
  setToken,
  setMsalAccount,
  login,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
