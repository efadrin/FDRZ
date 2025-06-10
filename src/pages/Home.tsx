import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to FDRZ</h1>
        <p className="hero-description">
          Your comprehensive workflow management system
        </p>
        
        {!isAuthenticated ? (
          <div className="cta-section">
            <p>Get started by logging into your account</p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        ) : (
          <div className="user-welcome">
            <h2>Hello, {user?.name}!</h2>
            <p>Ready to manage your workflows?</p>
            <div className="quick-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/workflows" className="btn btn-secondary">
                View Workflows
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h3>Key Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Workflow Management</h4>
            <p>Create, manage, and track your workflows efficiently</p>
          </div>
          <div className="feature-card">
            <h4>User Dashboard</h4>
            <p>Comprehensive overview of your tasks and progress</p>
          </div>
          <div className="feature-card">
            <h4>Secure Access</h4>
            <p>Protected routes and secure authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
