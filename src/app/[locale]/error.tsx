'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw, AlertTriangle, Info } from 'lucide-react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('error');
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = pathname?.startsWith('/ar') || false;
  const [isResetting, setIsResetting] = useState(false);
  
  // Get error details
  const errorDetails = {
    message: error.message || t('unknownError'),
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    digest: error.digest,
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page Error:', {
      ...errorDetails,
      path: window.location.pathname,
    });
    
    // You can also send this to an error tracking service
    // trackError(error);
  }, [error, errorDetails]);

  const handleReset = () => {
    setIsResetting(true);
    try {
      reset();
    } catch (resetError) {
      console.error('Error resetting:', resetError);
    } finally {
      setTimeout(() => setIsResetting(false), 1000);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div 
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-3xl space-y-8">
        {/* Error Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('title')}
          </h1>
          
          <p className="text-lg text-muted-foreground">
            {t('somethingWentWrong')}
          </p>
        </div>

        {/* Error Details */}
        <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-medium">
            {t('errorOccurred')}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="break-words">{errorDetails.message}</p>
            
            {errorDetails.digest && (
              <div className="mt-3 rounded-md bg-red-50 p-2 text-xs">
                <p className="font-medium">{t('errorId')}:</p>
                <code className="mt-1 block break-all rounded bg-white/50 p-1">
                  {errorDetails.digest}
                </code>
              </div>
            )}
            
            {errorDetails.stack && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">
                  {t('viewTechnicalDetails')}
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-white/50 p-2 text-xs">
                  {errorDetails.stack}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button
            onClick={handleReset}
            className="gap-2 px-6 py-3"
            variant="outline"
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? t('resetting') : t('tryAgain')}
          </Button>
          
          <Button 
            onClick={handleGoHome} 
            className="gap-2 px-6 py-3"
          >
            <Home className="h-4 w-4" />
            {t('backToHome')}
          </Button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-8 rounded-lg border bg-card p-4 text-card-foreground">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium">{t('needHelp')}؟</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('contactSupport')}{' '}
                <Link 
                  href="/contact" 
                  className="font-medium text-primary hover:underline"
                >
                  {t('contactPage')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
