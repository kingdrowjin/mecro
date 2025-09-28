import React, { useState, useEffect } from 'react';
import { useUserStore, eventBus } from '@shared/lib';
import './BookingModule.css';

interface Booking {
  id: string;
  facilityName: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  userName: string;
}

const BookingModule: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      facilityName: 'Conference Room A',
      date: '2025-01-15',
      time: '10:00',
      duration: 2,
      status: 'confirmed',
      userName: 'John Doe'
    },
    {
      id: '2',
      facilityName: 'Sports Hall',
      date: '2025-01-16',
      time: '14:00',
      duration: 1,
      status: 'pending',
      userName: 'Jane Smith'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: '',
    date: '',
    time: '',
    duration: 1,
    userName: user?.name || ''
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, userName: user.name }));
    }
  }, [user]);

  // Listen for authentication events
  useEffect(() => {
    const unsubscribeLogin = eventBus.on('auth:login', ({ user }: { user: any; token: string }) => {
      console.log('[Booking App] User logged in:', user.email);
    });

    const unsubscribeLogout = eventBus.on('auth:logout', () => {
      console.log('[Booking App] User logged out');
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please log in to create a booking');
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      ...formData,
      userName: user.name,
      status: 'pending'
    };

    setBookings([...bookings, newBooking]);

    // Emit booking created event
    eventBus.emit('booking:created', { bookingId: newBooking.id, booking: newBooking });

    setFormData({
      facilityName: '',
      date: '',
      time: '',
      duration: 1,
      userName: user.name
    });
    setShowForm(false);
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="booking-module">
        <div className="booking-container">
          <div className="booking-header">
            <h1>📅 Booking Management</h1>
            <p>Please log in to access the booking system</p>
            <div style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3>🔐 Authentication Required</h3>
              <p>You must be logged in to view and create bookings.</p>
              <p>Please navigate to the Authentication section to log in.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-module">
      <div className="booking-container">
        <div className="booking-header">
          <h1>📅 Booking Management</h1>
          <p>Manage facility bookings and reservations</p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Logged in as: <strong>{user?.name}</strong> ({user?.role})
          </p>
          <button
            className="booking-button primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancel' : '➕ New Booking'}
          </button>
        </div>

        {showForm && (
          <div className="booking-form-card">
            <h2>Create New Booking</h2>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Facility Name</label>
                <select
                  value={formData.facilityName}
                  onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
                  required
                >
                  <option value="">Select a facility</option>
                  <option value="Conference Room A">Conference Room A</option>
                  <option value="Conference Room B">Conference Room B</option>
                  <option value="Sports Hall">Sports Hall</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Library Study Room">Library Study Room</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={8}>Full day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="booking-button primary">
                💾 Create Booking
              </button>
            </form>
          </div>
        )}

        <div className="bookings-list">
          <div className="list-header">
            <h2>Current Bookings ({bookings.length})</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>📋 No bookings found</p>
              <p>Create your first booking to get started!</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <h3>{booking.facilityName}</h3>
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🕒</span>
                      <span>{booking.time} ({booking.duration}h)</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">👤</span>
                      <span>{booking.userName}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="booking-button secondary small"
                      onClick={() => alert(`Editing booking ${booking.id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="booking-button danger small"
                      onClick={() => deleteBooking(booking.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModule;