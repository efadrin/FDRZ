import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppSelector } from '../store/hooks';
import './Layout.css';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-logo">FDRZ</Link>
          <nav className="app-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/workflows">Workflows</Link>
          </nav>
          <div className="user-menu">
            {user && (
              <>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;