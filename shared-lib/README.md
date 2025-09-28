# Shared Library - Common Types & Utilities

Shared TypeScript library containing common types, interfaces, utilities, and constants used across all micro-frontends.

## Features

- **TypeScript Interfaces**: Common data structures and API types
- **Utility Functions**: Shared helper functions
- **Constants**: Application-wide constants
- **Event Types**: Cross-app communication event definitions
- **Validation Schemas**: Shared validation logic

## Exports

### Types
```typescript
// User and Authentication
export interface User { ... }
export interface AuthState { ... }

// Booking
export interface Booking { ... }
export interface Facility { ... }

// Reporting
export interface ReportData { ... }
export interface ChartConfig { ... }

// Events
export interface EventPayload { ... }
```

### Utilities
```typescript
// Date utilities
export const formatDate = (date: Date) => string
export const parseDate = (dateString: string) => Date

// Validation utilities
export const validateEmail = (email: string) => boolean
export const validateBooking = (booking: Booking) => ValidationResult

// API utilities
export const apiRequest = <T>(config: RequestConfig) => Promise<T>
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Development

```bash
npm run watch
```

## Usage in Other Projects

```bash
npm install ../shared-lib
```

```typescript
import { User, formatDate, validateEmail } from '@shared/lib'
```

## Available Scripts

- `npm run build` - Build the library
- `npm run watch` - Watch for changes and rebuild
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check