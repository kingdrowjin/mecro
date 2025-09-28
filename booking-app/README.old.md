# Booking App - Facility Booking Micro-Frontend

Facility booking micro-frontend that handles booking management and facility selection.

## Features

- **Booking Management**: Create, read, update, delete bookings
- **Facility Selection**: Choose from available facilities
- **Date/Time Selection**: Schedule bookings with date/time pickers
- **Form Validation**: Comprehensive booking form validation
- **Module Federation**: Exposes components for consumption by host app

## Exposed Components

- `BookingList` - Display list of bookings with filters
- `BookingForm` - Create/edit booking form
- `BookingModule` - Main booking module wrapper

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app on [http://localhost:3002](http://localhost:3002)

### Build

```bash
npm run build
```

## Module Federation Configuration

This app exposes the following modules:

```javascript
exposes: {
  './BookingList': './src/components/BookingList',
  './BookingForm': './src/components/BookingForm',
  './BookingModule': './src/BookingModule',
}
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check