import React, { useState, useEffect } from 'react';
import { useUserStore, eventBus } from '@shared/lib';
import './ReportingModule.css';

interface ReportData {
  label: string;
  value: number;
  color: string;
}

const ReportingModule: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('bookings');

  // Listen for authentication and booking events
  useEffect(() => {
    const unsubscribeLogin = eventBus.on('auth:login', ({ user }: { user: any; token: string }) => {
      console.log('[Reporting App] User logged in:', user.email);
    });

    const unsubscribeLogout = eventBus.on('auth:logout', () => {
      console.log('[Reporting App] User logged out');
    });

    const unsubscribeBooking = eventBus.on('booking:created', ({ bookingId, booking }: { bookingId: string; booking: any }) => {
      console.log('[Reporting App] New booking created:', bookingId);
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeBooking();
    };
  }, []);

  // Mock data
  const bookingData: ReportData[] = [
    { label: 'Conference Rooms', value: 45, color: '#2563eb' },
    { label: 'Sports Facilities', value: 32, color: '#10b981' },
    { label: 'Study Rooms', value: 28, color: '#f59e0b' },
    { label: 'Auditoriums', value: 15, color: '#ef4444' },
  ];

  const userActivityData: ReportData[] = [
    { label: 'New Users', value: 23, color: '#8b5cf6' },
    { label: 'Active Users', value: 156, color: '#06b6d4' },
    { label: 'Bookings Made', value: 89, color: '#84cc16' },
    { label: 'Cancellations', value: 12, color: '#f97316' },
  ];

  const getCurrentData = () => {
    return reportType === 'bookings' ? bookingData : userActivityData;
  };

  const getTotalValue = () => {
    return getCurrentData().reduce((sum, item) => sum + item.value, 0);
  };

  const getPercentage = (value: number) => {
    const total = getTotalValue();
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const generateMockTimeSeriesData = () => {
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 50) + 10
    }));
  };

  const timeSeriesData = generateMockTimeSeriesData();
  const maxValue = Math.max(...timeSeriesData.map(d => d.value));

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="reporting-module">
        <div className="reporting-container">
          <div className="reporting-header">
            <div className="header-content">
              <h1>📊 Analytics Dashboard</h1>
              <p>Please log in to access the analytics dashboard</p>
            </div>
            <div style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3>🔐 Authentication Required</h3>
              <p>You must be logged in to view reports and analytics.</p>
              <p>Please navigate to the Authentication section to log in.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin access required for regular users
  if (user?.role !== 'admin') {
    return (
      <div className="reporting-module">
        <div className="reporting-container">
          <div className="reporting-header">
            <div className="header-content">
              <h1>📊 Analytics Dashboard</h1>
              <p>Admin access required</p>
            </div>
            <div style={{
              padding: '2rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.5rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3>⚠️ Admin Access Required</h3>
              <p>This section is restricted to administrators only.</p>
              <p>Logged in as: <strong>{user?.name}</strong> ({user?.role})</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reporting-module">
      <div className="reporting-container">
        <div className="reporting-header">
          <div className="header-content">
            <h1>📊 Analytics Dashboard</h1>
            <p>Real-time insights and facility usage reports</p>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Logged in as: <strong>{user?.name}</strong> ({user?.role})
            </p>
          </div>

          <div className="controls">
            <div className="control-group">
              <label>Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="control-select"
              >
                <option value="bookings">Facility Bookings</option>
                <option value="users">User Activity</option>
              </select>
            </div>

            <div className="control-group">
              <label>Date Range:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="control-select"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="reporting-grid">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>Total {reportType === 'bookings' ? 'Bookings' : 'Activities'}</h3>
                <div className="summary-value">{getTotalValue()}</div>
                <div className="summary-change positive">+12% from last period</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">⭐</div>
              <div className="summary-content">
                <h3>Most Popular</h3>
                <div className="summary-value">{getCurrentData()[0]?.label}</div>
                <div className="summary-change">{getCurrentData()[0]?.value} bookings</div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">📅</div>
              <div className="summary-content">
                <h3>Average Daily</h3>
                <div className="summary-value">{Math.round(getTotalValue() / 30)}</div>
                <div className="summary-change">per day this month</div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2>Distribution Overview</h2>
              <button className="export-button">📥 Export</button>
            </div>

            <div className="pie-chart-container">
              <div className="pie-chart">
                {getCurrentData().map((item, index) => {
                  const percentage = getPercentage(item.value);
                  const angle = (percentage / 100) * 360;
                  const cumulativeAngle = getCurrentData()
                    .slice(0, index)
                    .reduce((sum, prev) => sum + getPercentage(prev.value), 0) * 3.6;

                  return (
                    <div
                      key={item.label}
                      className="pie-slice"
                      style={{
                        background: `conic-gradient(${item.color} 0deg ${angle}deg, transparent ${angle}deg)`,
                        transform: `rotate(${cumulativeAngle}deg)`,
                      }}
                    />
                  );
                })}
                <div className="pie-center">
                  <div className="pie-total">{getTotalValue()}</div>
                  <div className="pie-label">Total</div>
                </div>
              </div>

              <div className="chart-legend">
                {getCurrentData().map((item) => (
                  <div key={item.label} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="legend-label">{item.label}</span>
                    <span className="legend-value">
                      {item.value} ({getPercentage(item.value)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2>Usage Breakdown</h2>
              <button className="export-button">📊 View Details</button>
            </div>

            <div className="bar-chart">
              {getCurrentData().map((item, index) => (
                <div key={item.label} className="bar-item">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(item.value / Math.max(...getCurrentData().map(d => d.value))) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                    <div className="bar-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Series */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h2>Trend Analysis - {reportType === 'bookings' ? 'Daily Bookings' : 'Daily Activity'}</h2>
              <button className="export-button">📈 Full Report</button>
            </div>

            <div className="line-chart">
              <div className="chart-grid">
                {timeSeriesData.map((point, index) => (
                  <div
                    key={index}
                    className="chart-point"
                    style={{
                      left: `${(index / (timeSeriesData.length - 1)) * 100}%`,
                      bottom: `${(point.value / maxValue) * 80}%`,
                    }}
                    title={`${point.date}: ${point.value}`}
                  />
                ))}
              </div>

              <div className="chart-axes">
                <div className="y-axis">
                  <span>{maxValue}</span>
                  <span>{Math.round(maxValue * 0.5)}</span>
                  <span>0</span>
                </div>
                <div className="x-axis">
                  <span>{timeSeriesData[0]?.date}</span>
                  <span>{timeSeriesData[Math.floor(timeSeriesData.length / 2)]?.date}</span>
                  <span>{timeSeriesData[timeSeriesData.length - 1]?.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingModule;