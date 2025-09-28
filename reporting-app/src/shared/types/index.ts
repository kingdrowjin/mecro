// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Booking Types
export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  pricePerHour: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Reporting Types
export interface ReportData {
  id: string;
  title: string;
  data: ChartDataPoint[];
  type: ChartType;
  dateRange: DateRange;
  createdAt: Date;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
  category?: string;
}

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  AREA = 'area'
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Event Bus Types
export interface EventPayload<T = any> {
  type: string;
  data: T;
  timestamp: Date;
  source: string;
}

export interface EventSubscription {
  id: string;
  type: string;
  callback: (payload: EventPayload) => void;
}

// Module Federation Types
export interface ModuleConfig {
  name: string;
  url: string;
  scope: string;
  module: string;
  routes: string[];
  fallback: string;
  version?: string;
  isActive: boolean;
}

export interface ModuleRegistry {
  [key: string]: ModuleConfig;
}

// API Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}