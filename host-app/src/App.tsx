import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUserStore, eventBus } from '@shared/lib';
import Navigation from './components/Navigation';
import RemoteModule from './components/RemoteModule';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const HomePage: React.FC = () => (
  <div style={styles.container}>
    <div style={styles.hero}>
      <h1 style={styles.title}>Micro-Frontend Host Application</h1>
      <p style={styles.subtitle}>
        Welcome to the micro-frontend architecture demonstration.
        Navigate through different modules using the navigation above.
      </p>

      <div style={styles.moduleGrid}>
        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>🔐</div>
          <h3>Authentication</h3>
          <p>User login, logout, and profile management</p>
        </div>
        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>📅</div>
          <h3>Bookings</h3>
          <p>Facility booking and management system</p>
        </div>
        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>📊</div>
          <h3>Reports</h3>
          <p>Analytics dashboard with interactive charts</p>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();

  // Set up authentication event listeners
  useEffect(() => {
    const unsubscribeLogin = eventBus.on('auth:login', ({ user, token }) => {
      console.log('[Host App] User logged in:', user.email);
      // Additional host-specific login logic can go here
    });

    const unsubscribeLogout = eventBus.on('auth:logout', () => {
      console.log('[Host App] User logged out');
      // Additional host-specific logout logic can go here
    });

    const unsubscribeProfileUpdate = eventBus.on('user:profile-updated', ({ user }) => {
      console.log('[Host App] User profile updated:', user.email);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeProfileUpdate();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/auth/*"
                element={
                  <RemoteModule
                    moduleName="auth"
                    fallback={<div style={styles.loading}>Loading Authentication Module...</div>}
                  />
                }
              />
              <Route
                path="/booking/*"
                element={
                  <RemoteModule
                    moduleName="booking"
                    fallback={<div style={styles.loading}>Loading Booking Module...</div>}
                  />
                }
              />
              <Route
                path="/reports/*"
                element={
                  <RemoteModule
                    moduleName="reporting"
                    fallback={<div style={styles.loading}>Loading Reporting Module...</div>}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <div style={styles.notFound}>
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

const styles = {
  main: {
    minHeight: 'calc(100vh - 64px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  hero: {
    textAlign: 'center' as const,
    padding: '4rem 0',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
    lineHeight: '1.6',
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  },
  moduleCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    border: '1px solid #e5e7eb',
  },
  moduleIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '1.25rem',
    color: '#6b7280',
  },
  notFound: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    color: '#6b7280',
  },
};

export default App;
