'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <DefaultErrorFallback 
        error={this.state.error} 
        onReset={this.handleReset} 
      />;
    }

    return this.props.children;
  }
}

// Default error fallback component
export function DefaultErrorFallback({ 
  error, 
  onReset 
}: { 
  error?: Error;
  onReset?: () => void;
}) {
  const t = useTranslations('error');
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-lg font-semibold text-red-800">
            {t('title')}
          </AlertTitle>
          <AlertDescription className="mt-2 text-red-700">
            {t('message')}
          </AlertDescription>
          
          {error?.message && (
            <div className="mt-4 rounded-md bg-red-100 p-3 text-sm">
              <p className="font-medium">{error.message}</p>
              {process.env.NODE_ENV === 'development' && error.stack && (
                <pre className="mt-2 overflow-auto rounded bg-white/50 p-2 text-xs text-red-600">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-3">
            {onReset && (
              <Button
                variant="outline"
                onClick={onReset}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {t('tryAgain')}
              </Button>
            )}
            
            <Button asChild variant="destructive">
              <a href="/">
                {t('backToHome')}
              </a>
            </Button>
          </div>
        </Alert>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              {t('development.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('development.message')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to use the error boundary in functional components
export function useErrorHandler() {
  const throwToErrorBoundary = (error: Error) => {
    throw error;
  };
  
  return { throwToErrorBoundary };
}
