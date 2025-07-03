'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';

// Define the type for the component props
type NotFoundProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function NotFound({ error, reset }: NotFoundProps) {
  const t = useTranslations('notFound');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Check if the current locale is RTL
  const isRTL = useMemo(() => {
    return pathname?.startsWith('/ar') || false;
  }, [pathname]);

  // Get the current locale from the URL
  const currentLocale = useMemo((): Locale => {
    const locale = pathname?.split('/')[1];
    return locale === 'ar' ? 'ar' : 'en';
  }, [pathname]);

  // Set document title and log error if present
  useEffect(() => {
    document.title = t('title');
    
    if (error) {
      console.error('Page error:', error);
      // You can log this to an error reporting service
      // logErrorToService(error);
    }
  }, [t, error]);

  // Handle retry action
  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
  };

  // Get the current URL for reporting
  const currentUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  }, []);

  return (
    <div 
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-800 md:text-5xl">
              {t('title')}
            </h2>
          </div>
        </div>
        
        <p className="text-xl text-gray-600">
          {error ? t('errorOccurred') : t('message')}
        </p>
        
        {error?.digest && (
          <div className="rounded-md bg-gray-100 p-4 text-sm text-gray-600">
            <p className="font-medium">Error ID: {error.digest}</p>
            <p className="mt-1 text-xs opacity-75">
              {currentUrl}
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            className="px-6 py-5 text-base"
            onClick={handleRetry}
          >
            <Link href={`/${currentLocale}`}>
              {t('backToHome')}
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="px-6 py-5 text-base"
          >
            <Link href={`/${currentLocale}/contact`}>
              {t('contactSupport')}
            </Link>
          </Button>
          
          {error && (
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-base"
              onClick={handleRetry}
            >
              {t('tryAgain')}
            </Button>
          )}
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            {t('orTry')}{' '}
            <Link href="/search" className="text-amber-600 hover:underline">
              {t('searchPage')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
