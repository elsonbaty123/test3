'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom500() {
  const t = useTranslations('error');
  const pathname = usePathname();
  const isRTL = pathname?.startsWith('/ar') || false;

  return (
    <div 
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-red-500">500</h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            {t('serverErrorTitle')}
          </h2>
        </div>

        <p className="text-lg text-gray-600">
          {t('serverErrorMessage')}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="px-6 py-3 text-base"
          >
            {t('refreshPage')}
          </Button>
          
          <Button asChild className="px-6 py-3 text-base">
            <Link href="/">
              {t('backToHome')}
            </Link>
          </Button>
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            {t('needHelp')}{' '}
            <Link 
              href="/contact" 
              className="font-medium text-amber-600 hover:underline"
            >
              {t('contactSupport')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
