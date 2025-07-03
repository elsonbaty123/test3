import { ReactNode, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/lib/i18n-config';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/lib/i18n-config';
import { setRequestLocale } from 'next-intl/server';
import { AbstractIntlMessages } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter, Tajawal } from 'next/font/google';
import { ErrorBoundary } from '@/components/error-boundary';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/nextjs';
import { ErrorFallback } from '@/components/error-fallback';
import '../../../src/app/globals.css';

// تحميل الخطوط
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
});

// أنواع البيانات
interface LocaleLayoutProps {
  children: ReactNode;
  params: { 
    locale: Locale;
  };
}

// دالة لإنشاء البيانات الوصفية
// export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
//   const messages = await getMessages(locale);
//   return {
//     title: messages.metadata?.title || 'Wagbty',
//     description: messages.metadata?.description || 'Discover the best homemade food',
//   };
// }

// المكون الرئيسي للتخطيط
// @ts-ignore
// export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
//   // التحقق من صحة اللغة
//   if (!locales.includes(locale as any)) {
//     notFound();
//   }

//   // تعيين لغة الطلب
//   unstable_setRequestLocale(locale);

//   // جلب الرسائل
//   const messages = await getMessages(locale);

//   return (
//     <html 
//       lang={locale} 
//       dir={locale === 'ar' ? 'rtl' : 'ltr'}
//       className={cn(
//         locale === 'ar' ? tajawal.variable : inter.variable,
//         'h-full',
//         locale === 'ar' ? 'font-tajawal' : 'font-sans'
//       )}
//     >
//       <body className={cn(
//         'min-h-screen bg-background',
//         locale === 'ar' ? 'text-right' : 'text-left'
//       )}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <NextIntlClientProvider locale={locale} messages={messages}>
//             {children}
//             <Toaster />
//           </NextIntlClientProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Set the request locale for next-intl
  setRequestLocale(locale);

  // Get messages and other async data
  const messages = await getMessages(locale);
  
  // If no messages were loaded, show 404
  if (!messages || Object.keys(messages).length === 0) {
    console.error(`No messages found for locale: ${locale}`);
    notFound();
  }

  const timeZone = 'Asia/Riyadh';
  const isRTL = locale === 'ar';

  return (
    <html 
      lang={locale} 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        isRTL ? tajawal.variable : inter.variable,
        'h-full',
        isRTL ? 'font-tajawal' : 'font-sans',
        // Add any global CSS variables here
        'bg-background text-foreground'
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href={`/locales/${locale}.json`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn(
        'min-h-screen',
        isRTL ? 'text-right' : 'text-left',
        'antialiased',
        'bg-background text-foreground'
      )}>
        <SentryErrorBoundary 
          fallback={({ error, resetError }) => {
            // Ensure we have a proper Error object
            const errorObj = error instanceof Error 
              ? error 
              : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
              
            return (
              <ErrorFallback 
                error={errorObj} 
                reset={resetError}
              />
            );
          }}
        >
          <ErrorBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextIntlClientProvider 
                locale={locale}
                messages={messages}
                timeZone={timeZone}
                now={new Date()}
              >
                <Suspense fallback={
                  <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                }>
                  {children}
                </Suspense>
                
                <Toaster />
                <Analytics />
                <SpeedInsights />
                
                {/* Progress bar for page transitions */}
                <ProgressBar
                  height="3px"
                  color="#3b82f6"
                  options={{ showSpinner: false }}
                  shallowRouting
                />
              </NextIntlClientProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </SentryErrorBoundary>
      </body>
    </html>
  )
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale: Locale) => ({
    locale,
  }));
}

// Disable dynamic params for better caching
export const dynamicParams = false;
