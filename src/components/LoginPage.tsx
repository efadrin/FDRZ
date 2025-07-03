import React, { useEffect, useState } from 'react';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manual login with', email, password);
    // TODO: Replace this with your API call (e.g., login mutation)
  };

  const showSilentOption = accounts.length > 0;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign in to Efadrin</h2>
        <p className="login-subtitle">Please sign in to continue</p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          <MicrosoftLogo />
          {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
        </button>

        {showSilentOption && (
          <>
            <div className="divider">or</div>
            <button
              className="login-button secondary"
              onClick={handleSilentLogin}
              disabled={isLoading}
            >
              <MicrosoftLogo />
              Continue with saved account
            </button>
          </>
        )}

        <div className="divider">or</div>

        <form onSubmit={handleManualSubmit} className="manual-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer-text">
          By signing in, you agree to Efadrin's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <div className="login-footer">
        <p>Don’t have an account? <a href="#">Sign up</a></p>
        <p className="secured-text">Secured by <strong>Efadrin</strong></p>
      </div>
    </div>
  );
};

const MicrosoftLogo: React.FC = () => (
  <svg viewBox="0 0 23 23" width="20" height="20" style={{ marginRight: '8px' }}>
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

export default LoginPage;
