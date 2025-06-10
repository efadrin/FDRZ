import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppSelector } from '../store/hooks';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const { login, loginSilent } = useAuth();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSilentLogin = async () => {
    try {
      await loginSilent();
    } catch (error) {
      console.error('Silent login failed:', error);
    }
  };

  const showSilentOption = accounts.length > 0;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <h1 className="logo">FDRZ</h1>
          <p className="tagline">Workflow Management Platform</p>
        </div>

        <div className="login-form">
          <h2 className="form-title">Welcome to FDRZ</h2>
          <p className="form-subtitle">Sign in with your Microsoft account to continue</p>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            className="microsoft-btn"
            onClick={handleLogin}
            disabled={isLoading}
            aria-label="Sign in with Microsoft"
          >
            <MicrosoftLogo />
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>

          {showSilentOption && (
            <>
              <div className="divider">or</div>
              <button
                className="microsoft-btn secondary"
                onClick={handleSilentLogin}
                disabled={isLoading}
                aria-label="Continue with saved account"
              >
                <MicrosoftLogo />
                Continue with saved account
              </button>
            </>
          )}
        </div>

        <div className="info-section">
          <p>By signing in, you agree to FDRZ's Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

const MicrosoftLogo: React.FC = () => (
  <svg className="microsoft-logo" viewBox="0 0 23 23" width="20" height="20">
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

export default LoginPage;
