//@ts-nocheck

import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useUserStore, eventBus } from './shared';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import './AuthModule.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthModule: React.FC = () => {
  const { user, isAuthenticated, isLoading, login: storeLogin, logout: storeLogout, setLoading } = useUserStore();
  const navigate = useNavigate();

  // Simulated authentication service
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (email === 'admin@example.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://via.placeholder.com/100x100?text=AU'
      };

      // Generate mock token
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Use shared store
      storeLogin(mockUser, token);

      // Emit event for cross-app communication
      eventBus.emit('auth:login', { user: mockUser, token });

      return true;
    } else if (email === 'user@example.com' && password === 'password') {
      const mockUser: User = {
        id: '2',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        avatar: 'https://via.placeholder.com/100x100?text=RU'
      };

      // Generate mock token
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Use shared store
      storeLogin(mockUser, token);

      // Emit event for cross-app communication
      eventBus.emit('auth:login', { user: mockUser, token });

      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    // Use shared store
    storeLogout();

    // Emit event for cross-app communication
    eventBus.emit('auth:logout');

    navigate('/auth');
  };

  const authContext: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    loading: isLoading
  };

  return (
    <div className="auth-module">
      <div className="auth-container">
        <Routes>
          <Route
            path="/"
            element={
              <LoginForm
                authContext={authContext}
                onLoginSuccess={() => navigate('/auth/profile')}
              />
            }
          />
          <Route
            path="/profile"
            element={
              authContext.isAuthenticated ? (
                <ProfilePage authContext={authContext} />
              ) : (
                <div className="auth-redirect">
                  <h3>Please log in to access your profile</h3>
                  <button
                    className="auth-button"
                    onClick={() => navigate('/auth')}
                  >
                    Go to Login
                  </button>
                </div>
              )
            }
          />
          <Route
            path="*"
            element={
              <div className="auth-not-found">
                <h3>Auth Page Not Found</h3>
                <p>The requested authentication page doesn't exist.</p>
                <button
                  className="auth-button"
                  onClick={() => navigate('/auth')}
                >
                  Back to Login
                </button>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AuthModule;