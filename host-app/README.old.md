# Host App - Micro-Frontend Container

This is the main container application that orchestrates and loads micro-frontends dynamically using Webpack Module Federation.

## Features

- **Dynamic Module Loading**: Loads micro-frontends at runtime based on configuration
- **Routing**: Manages navigation between different micro-frontend modules
- **Error Handling**: Provides fallback UI when modules are unavailable
- **Runtime Configuration**: Loads module URLs from JSON configuration

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

Runs the app on [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## Architecture

The host app uses Webpack Module Federation to consume remote modules:

- **Auth Module**: `http://localhost:3001/remoteEntry.js`
- **Booking Module**: `http://localhost:3002/remoteEntry.js`
- **Reporting Module**: `http://localhost:3003/remoteEntry.js`

## Configuration

Module configuration is managed via `public/module-config.json` for runtime flexibility.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check