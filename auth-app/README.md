# Auth App - Authentication Micro-Frontend

Authentication micro-frontend that handles user login, logout, and profile management.

## Features

- **User Authentication**: Login and logout functionality
- **User Profile Management**: View and edit user profiles
- **JWT Token Handling**: Secure token management
- **Module Federation**: Exposes components for consumption by host app

## Exposed Components

- `Login` - Login form component
- `UserProfile` - User profile display and editing
- `AuthModule` - Main authentication module wrapper

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

Runs the app on [http://localhost:3001](http://localhost:3001)

### Build

```bash
npm run build
```

## Module Federation Configuration

This app exposes the following modules:

```javascript
exposes: {
  './Login': './src/components/Login',
  './UserProfile': './src/components/UserProfile',
  './AuthModule': './src/AuthModule',
}
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check