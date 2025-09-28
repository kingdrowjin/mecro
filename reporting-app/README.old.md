# Reporting App - Analytics & Charts Micro-Frontend

Analytics and reporting micro-frontend that provides data visualization and reporting capabilities.

## Features

- **Interactive Charts**: Bar, line, and pie charts using Recharts
- **Data Filtering**: Date range and custom filters
- **Real-time Analytics**: Live data updates
- **Export Functionality**: Export reports and data
- **Module Federation**: Exposes components for consumption by host app

## Exposed Components

- `ReportDashboard` - Main analytics dashboard
- `ChartComponents` - Various chart types
- `ReportingModule` - Main reporting module wrapper

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

Runs the app on [http://localhost:3003](http://localhost:3003)

### Build

```bash
npm run build
```

## Module Federation Configuration

This app exposes the following modules:

```javascript
exposes: {
  './ReportDashboard': './src/components/ReportDashboard',
  './ChartComponents': './src/components/ChartComponents',
  './ReportingModule': './src/ReportingModule',
}
```

## Dependencies

- **Recharts**: For data visualization
- **Date-fns**: For date manipulation
- **Lodash**: For data processing utilities

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check