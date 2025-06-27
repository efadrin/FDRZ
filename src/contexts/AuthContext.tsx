import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig, loginRequest } from "../services/msalConfig";
import { useAppDispatch } from "../store/hooks";
import {
  setUser,
  setToken,
  setMsalAccount,
  logout as logoutAction,
  setError,
  setLoading,
} from "../store/slices/authSlice";
import { useMicrosoftLoginMutation } from "../store/api/authApi";

interface AuthContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginSilent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const msalInstance = new PublicClientApplication(msalConfig);

// Inner component that uses MSAL hooks
const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { instance, accounts } = useMsal();
  const dispatch = useAppDispatch();
  const [microsoftLogin] = useMicrosoftLoginMutation();

  useEffect(() => {
    // Initialize auth state from stored token
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    // Update MSAL account in Redux when it changes
    if (accounts.length > 0) {
      dispatch(setMsalAccount(accounts[0]));
    } else {
      dispatch(setMsalAccount(null));
    }
  }, [accounts, dispatch]);

  const login = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      console.log("🔐 Starting MSAL login...");

      const loginResponse = await instance.loginPopup(loginRequest);
      console.log("✅ MSAL login successful:", {
        hasToken: !!loginResponse.accessToken,
        account: loginResponse.account?.username,
        tokenLength: loginResponse.accessToken?.length,
      });

      if (loginResponse && loginResponse.accessToken) {
        console.log("🚀 Sending token to FDRW backend...");

        // Send the Microsoft Graph token directly to FDRW backend
        const result = await microsoftLogin({
          accessToken: loginResponse.accessToken,
          email: loginResponse.account?.username || "",
          name: loginResponse.account?.name || "",
          microsoftId: loginResponse.account?.homeAccountId || "",
        }).unwrap();

        console.log("📥 FDRW backend response:", result);

        // FDRW backend returns a different structure
        if (result.succeeded && result.data.sessionToken) {
          console.log("✅ Login successful, setting tokens...");
          dispatch(setToken(result.data.sessionToken));
          // Create user object from MSAL response since FDRW doesn't return user details
          const user = {
            id: loginResponse.account?.homeAccountId || "",
            name: loginResponse.account?.name || "",
            email: loginResponse.account?.username || "",
            role: "user", // Default role
          };
          dispatch(setUser(user));
        } else {
          console.error("❌ FDRW backend validation failed:", result);
          throw new Error(result.message || "Login failed");
        }
      }
    } catch (error: any) {
      console.error("❌ Login error details:", {
        error,
        message: error?.message,
        data: error?.data,
        status: error?.status,
      });

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [instance, microsoftLogin, dispatch]);

  const loginSilent = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      if (accounts.length === 0) {
        throw new Error("No saved accounts found");
      }

      const silentRequest = {
        ...loginRequest,
        account: accounts[0],
      };

      const loginResponse = await instance.acquireTokenSilent(silentRequest);

      if (loginResponse && loginResponse.accessToken) {
        // Send the Microsoft Graph token directly to FDRW backend
        const result = await microsoftLogin({
          accessToken: loginResponse.accessToken,
          email: loginResponse.account?.username || "",
          name: loginResponse.account?.name || "",
          microsoftId: loginResponse.account?.homeAccountId || "",
        }).unwrap();

        // FDRW backend returns a different structure
        if (result.succeeded && result.data.sessionToken) {
          dispatch(setToken(result.data.sessionToken));
          // Create user object from MSAL response since FDRW doesn't return user details
          const user = {
            id: loginResponse.account?.homeAccountId || "",
            name: loginResponse.account?.name || "",
            email: loginResponse.account?.username || "",
            role: "user", // Default role
          };
          dispatch(setUser(user));
        } else {
          throw new Error(result.message || "Silent login failed");
        }
      }
    } catch (error) {
      // Fall back to interactive login
      await login();
    } finally {
      dispatch(setLoading(false));
    }
  }, [instance, accounts, microsoftLogin, dispatch, login]);

  // Auto-login effect - try silent authentication on app startup
  useEffect(() => {
    if (accounts.length > 0) {
      loginSilent().catch(() => {
        console.log("Silent login failed, user interaction required");
      });
    }
  }, [accounts, loginSilent]);

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await instance.logoutPopup();
      dispatch(logoutAction());
    } catch (error) {
      dispatch(setError("Logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [instance, dispatch]);

  const contextValue: AuthContextType = {
    login,
    logout,
    loginSilent,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Outer component that provides MSAL
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </MsalProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
