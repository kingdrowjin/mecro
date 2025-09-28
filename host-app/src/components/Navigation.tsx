import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore, eventBus } from '../shared';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUserStore();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/auth', label: 'Authentication', icon: '🔐' },
    { path: '/booking', label: 'Bookings', icon: '📅' },
    { path: '/reports', label: 'Reports', icon: '📊' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    eventBus.emit('auth:logout', undefined);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h2 style={styles.brandText}>Micro-Frontend Host</h2>
        </div>
        <div style={styles.navSection}>
          <ul style={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path} style={styles.navItem}>
                <Link
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive(item.path) ? styles.activeLink : {}),
                  }}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated && user && (
            <div style={styles.userSection}>
              <span style={styles.userInfo}>
                👤 {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2563eb',
    padding: '0 1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  brand: {
    color: 'white',
  },
  brandText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '0.5rem',
  },
  navItem: {
    display: 'flex',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  },
  activeLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: '1.2rem',
  },
  navSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Navigation;