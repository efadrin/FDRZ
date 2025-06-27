// FDRW Authentication Constants
export const AuthStatusConst = {
  initial: "initial",
  loggedIn: "fdrw_logged_in",
  failed: "failed",
} as const;

export type AuthStatus = (typeof AuthStatusConst)[keyof typeof AuthStatusConst];

// FDRW Backend API URL
export const BASE_API_URL =
  process.env.REACT_APP_API_URL ||
  "https://hkg.efadrin.biz:8453/efadrin/v3.0/fdrw-api/api";
