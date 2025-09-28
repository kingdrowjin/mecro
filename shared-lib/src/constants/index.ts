// Application Constants
export const APP_NAME = 'Micro-Frontend System';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication Constants
export const TOKEN_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'user_data';
export const TOKEN_REFRESH_THRESHOLD = 300000; // 5 minutes in milliseconds

// Module Federation Constants
export const MODULE_FEDERATION_PORTS = {
  HOST: 3000,
  AUTH: 3001,
  BOOKING: 3002,
  REPORTING: 3003
} as const;

export const MODULE_REMOTE_URLS = {
  AUTH: `http://localhost:${MODULE_FEDERATION_PORTS.AUTH}/remoteEntry.js`,
  BOOKING: `http://localhost:${MODULE_FEDERATION_PORTS.BOOKING}/remoteEntry.js`,
  REPORTING: `http://localhost:${MODULE_FEDERATION_PORTS.REPORTING}/remoteEntry.js`
} as const;

// Event Types for Cross-App Communication
export const EVENT_TYPES = {
  // Authentication Events
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_PROFILE_UPDATE: 'user:profile:update',
  TOKEN_REFRESH: 'auth:token:refresh',

  // Booking Events
  BOOKING_CREATED: 'booking:created',
  BOOKING_UPDATED: 'booking:updated',
  BOOKING_DELETED: 'booking:deleted',
  BOOKING_STATUS_CHANGED: 'booking:status:changed',

  // Reporting Events
  REPORT_GENERATED: 'report:generated',
  DATA_REFRESH_REQUESTED: 'data:refresh:requested',

  // Module Events
  MODULE_LOADED: 'module:loaded',
  MODULE_ERROR: 'module:error',
  MODULE_UNLOADED: 'module:unloaded',

  // General Events
  NOTIFICATION_SHOW: 'notification:show',
  NOTIFICATION_HIDE: 'notification:hide',
  THEME_CHANGED: 'theme:changed'
} as const;

// Booking Constants
export const BOOKING_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed'
} as const;

export const BOOKING_DURATION_OPTIONS = [
  { value: 0.5, label: '30 minutes' },
  { value: 1, label: '1 hour' },
  { value: 1.5, label: '1.5 hours' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4 hours' },
  { value: 8, label: '8 hours' },
  { value: 24, label: 'Full day' }
] as const;

// Chart Constants
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  SUCCESS: '#059669',
  LIGHT: '#F3F4F6',
  DARK: '#1F2937'
} as const;

export const CHART_COLOR_PALETTE = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#6366F1', '#059669', '#8B5CF6', '#06B6D4',
  '#84CC16', '#F97316', '#EC4899', '#14B8A6'
] as const;

// Date Format Constants
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'YYYY-MM-DD',
  WITH_TIME: 'YYYY-MM-DD HH:mm',
  TIME_ONLY: 'HH:mm',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm'
} as const;

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 254,
  BOOKING_NOTES_MAX_LENGTH: 500
} as const;

// UI Constants
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 1050,
  NOTIFICATION: 1100,
  TOOLTIP: 1200
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD: 'FIELD_REQUIRED',

  // Booking
  BOOKING_CONFLICT: 'BOOKING_TIME_CONFLICT',
  FACILITY_UNAVAILABLE: 'FACILITY_UNAVAILABLE',

  // Module Federation
  MODULE_LOAD_FAILED: 'MODULE_LOAD_FAILED',
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'REQUEST_TIMEOUT'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in',
  LOGOUT: 'Successfully logged out',
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_UPDATED: 'Booking updated successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  REPORT_GENERATED: 'Report generated successfully'
} as const;

// Default Values
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_DEBOUNCE_DELAY = 300;
export const DEFAULT_NOTIFICATION_DURATION = 5000;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_EXPORT_FUNCTIONALITY: true
} as const;