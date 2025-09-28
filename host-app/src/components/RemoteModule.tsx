import React, { Suspense, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import moduleLoader from '../services/moduleLoader';

interface RemoteModuleProps {
  moduleName: string;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

const LoadingSpinner: React.FC = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p style={styles.loadingText}>Loading module...</p>
  </div>
);

const RemoteModule = ({
  moduleName,
  fallback,
  onError,
}: RemoteModuleProps): React.ReactElement => {
  const [ModuleComponent, setModuleComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError(null);

        const module = await moduleLoader.getModuleByName(moduleName);

        // Try to get the default export or the module name export
        const Component = module.default || module[moduleName] || module[`${moduleName}Module`];

        if (!Component) {
          throw new Error(`No valid component found in module ${moduleName}`);
        }

        setModuleComponent(() => Component);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Failed to load module ${moduleName}`);
        setError(error);
        if (onError) {
          onError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleName, onError]);

  if (error) {
    return (
      <ErrorBoundary
        moduleName={moduleName}
        fallback={fallback}
      >
        <div style={styles.errorContainer}>
          <h3>Failed to load {moduleName} module</h3>
          <p>{error.message}</p>
          <button
            style={styles.retryButton}
            onClick={() => {
              setError(null);
              setLoading(true);
              // Trigger re-render to reload module
              setModuleComponent(null);
            }}
          >
            Retry
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  if (loading || !ModuleComponent) {
    return <>{fallback || <LoadingSpinner />}</>;
  }

  return (
    <ErrorBoundary moduleName={moduleName} fallback={fallback}>
      <Suspense fallback={<>{fallback || <LoadingSpinner />}</>}>
        <ModuleComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  errorContainer: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    margin: '1rem',
  },
  retryButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

// Add CSS keyframes for spinner animation
const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject spinner styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = spinnerStyles;
  document.head.appendChild(styleSheet);
}

export default RemoteModule;