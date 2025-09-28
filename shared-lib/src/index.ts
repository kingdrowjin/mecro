// Export all utilities
export * from './utils';

// Export all constants
export * from './constants';

// Export types (excluding User to avoid conflicts)
export type {
  AuthState, LoginCredentials, RegisterData,
  Facility, Booking, BookingStatus,
  ReportData, ChartDataPoint, ChartType, DateRange,
  EventPayload, EventSubscription,
  ModuleConfig, ModuleRegistry,
  ApiResponse, ApiError, PaginatedResponse,
  ValidationResult, ValidationError
} from './types';

// Export stores (this will export UserStoreUser as the User type for the store)
export { useUserStore } from './stores/userStore';

// Export event bus
export { eventBus } from './events/eventBus';
export type { EventBusEvents } from './events/eventBus';

// Export hooks
export { useAppMessaging } from './hooks/useAppMessaging';