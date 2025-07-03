import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset?: () => void;
};

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const t = useTranslations('error');
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-lg font-semibold text-red-800">
              {t('title')}
            </AlertTitle>
          </div>
          
          <AlertDescription className="mt-2 space-y-4 text-red-700">
            <p>{t('message')}</p>
            
            {error?.message && (
              <div className="rounded-md bg-red-100 p-3">
                <p className="text-sm font-medium">{error.message}</p>
                
                {error.digest && (
                  <p className="mt-1 text-xs text-red-600">
                    Error ID: {error.digest}
                  </p>
                )}
                
                {process.env.NODE_ENV === 'development' && error.stack && (
                  <pre className="mt-2 overflow-auto rounded bg-white/50 p-2 text-xs">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 pt-2">
              {reset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('tryAgain')}
                </Button>
              )}
              
              <Button asChild size="sm" variant="destructive">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  {t('backToHome')}
                </Link>
              </Button>
            </div>
          </AlertDescription>
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
