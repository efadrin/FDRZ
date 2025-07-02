import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../services/msalConfig';
import { useAppDispatch } from '../store/hooks';
import { setUser, setToken, setMsalAccount, logout as logoutAction, setError, setLoading } from '../store/slices/authSlice';
import { useLoginMutation } from '../store/api/authApi';

interface AuthContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginSilent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const msalInstance = new PublicClientApplication(msalConfig);

// Inner component that uses MSAL hooks
const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {  const { instance, accounts } = useMsal();
  const dispatch = useAppDispatch();
  const [microsoftLogin] = useLoginMutation();
  useEffect(() => {
    // Initialize auth state from stored token
    const token = localStorage.getItem('authToken');
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
      
      const loginResponse = await instance.loginPopup(loginRequest);
      if (loginResponse && loginResponse.account) {
        const result = await microsoftLogin({
          Token: loginResponse.accessToken
        }).unwrap();
        
        dispatch(setToken(result.SessionToken));
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed. Please try again.';
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
        throw new Error('No saved accounts found');
      }

      const silentRequest = {
        ...loginRequest,
        account: accounts[0],
      };

      const loginResponse = await instance.acquireTokenSilent(silentRequest);
      
      if (loginResponse && loginResponse.account) {
        const result = await microsoftLogin({
          Token: loginResponse.accessToken,       
        }).unwrap();
        
        dispatch(setToken(result.SessionToken));
      }
    } catch (error) {
      // Fall back to interactive login
      await login();
    } finally {
      dispatch(setLoading(false));
    }
  }, [instance, accounts, microsoftLogin, dispatch, login]);

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await instance.logoutPopup();
      dispatch(logoutAction());
    } catch (error) {
      dispatch(setError('Logout failed'));
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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Outer component that provides MSAL
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </MsalProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};