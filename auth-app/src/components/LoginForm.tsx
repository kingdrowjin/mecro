import React, { useState } from 'react';
import { AuthContextType } from '../AuthModule';

interface LoginFormProps {
  authContext: AuthContextType;
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ authContext, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const success = await authContext.login(email, password);

    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid email or password. Try admin@example.com / password or user@example.com / password');
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail('admin@example.com');
      setPassword('password');
    } else {
      setEmail('user@example.com');
      setPassword('password');
    }
    setError('');
    setValidationErrors({});
  };

  if (authContext.isAuthenticated) {
    return (
      <div className="auth-card">
        <div className="auth-success">
          <div className="success-icon">✅</div>
          <h2>Welcome back, {authContext.user?.name}!</h2>
          <p>You are successfully logged in.</p>
          <div className="auth-actions">
            <button
              className="auth-button primary"
              onClick={onLoginSuccess}
            >
              Go to Profile
            </button>
            <button
              className="auth-button secondary"
              onClick={authContext.logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1>🔐 Login</h1>
        <p>Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={validationErrors.email ? 'error' : ''}
            placeholder="Enter your email"
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={validationErrors.password ? 'error' : ''}
            placeholder="Enter your password"
          />
          {validationErrors.password && (
            <span className="error-message">{validationErrors.password}</span>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          className={`auth-button primary ${authContext.loading ? 'loading' : ''}`}
          disabled={authContext.loading}
        >
          {authContext.loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="demo-section">
        <p className="demo-title">Demo Credentials:</p>
        <div className="demo-buttons">
          <button
            type="button"
            className="demo-button"
            onClick={() => fillDemoCredentials('admin')}
          >
            👤 Admin User
          </button>
          <button
            type="button"
            className="demo-button"
            onClick={() => fillDemoCredentials('user')}
          >
            👤 Regular User
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;