import React, { useState } from 'react';
import { AuthContextType } from '../AuthModule';

interface ProfilePageProps {
  authContext: AuthContextType;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ authContext }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authContext.user?.name || '',
    email: authContext.user?.email || '',
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // Mock success message
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: authContext.user?.name || '',
      email: authContext.user?.email || '',
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#dc2626';
      case 'user':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  const getPermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          'Full system access',
          'User management',
          'Booking management',
          'Report generation',
          'Settings configuration'
        ];
      case 'user':
        return [
          'View own bookings',
          'Create new bookings',
          'View basic reports',
          'Edit own profile'
        ];
      default:
        return ['Limited access'];
    }
  };

  if (!authContext.user) {
    return (
      <div className="auth-card">
        <div className="error-state">
          <h2>❌ Not Authenticated</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={authContext.user.avatar}
            alt={authContext.user.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x100?text=${authContext.user?.name.charAt(0) || 'U'}`;
            }}
          />
        </div>
        <div className="profile-title">
          <h1>👤 User Profile</h1>
          <p>Manage your account information</p>
        </div>
        <button
          className="auth-button secondary"
          onClick={authContext.logout}
        >
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="profile-value">{authContext.user.name}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="profile-value">{authContext.user.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>User Role</label>
              <div
                className="role-badge"
                style={{ backgroundColor: getRoleColor(authContext.user.role) }}
              >
                {authContext.user.role.toUpperCase()}
              </div>
            </div>

            <div className="form-group">
              <label>User ID</label>
              <div className="profile-value">{authContext.user.id}</div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  className="auth-button primary"
                  onClick={handleSave}
                >
                  💾 Save Changes
                </button>
                <button
                  className="auth-button secondary"
                  onClick={handleCancel}
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h2>Permissions & Access</h2>
          </div>
          <div className="permissions-list">
            {getPermissions(authContext.user.role).map((permission, index) => (
              <div key={index} className="permission-item">
                <span className="permission-icon">✓</span>
                {permission}
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h2>Session Information</h2>
          </div>
          <div className="session-info">
            <div className="info-item">
              <strong>Login Status:</strong>
              <span className="status-active">🟢 Active</span>
            </div>
            <div className="info-item">
              <strong>Last Login:</strong>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="info-item">
              <strong>Session Type:</strong>
              <span>Local Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;