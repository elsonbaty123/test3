import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorBoundary } from '@/components/error-boundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from '@/components/ui/toaster';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

// Import global styles
import '@/styles/globals.css';

// Import fonts
import { Inter, Tajawal } from 'next/font/google';

// Configure fonts
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

export default function App({
  Component,
  pageProps,
  router: appRouter,
}: AppProps & { router: any }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add a class to the body based on the theme
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
  }, [isRTL, locale]);

  // Don't render the app until we're on the client
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NextIntlClientProvider
        locale={locale}
        messages={pageProps.messages}
        timeZone="Asia/Riyadh"
        now={new Date()}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={`${inter.variable} ${tajawal.variable} font-sans ${
              isRTL ? 'rtl' : 'ltr'
            }`}
          >
            <Component {...pageProps} />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <ProgressBar
              height="3px"
              color="#3b82f6"
              options={{ showSpinner: false }}
              shallowRouting
            />
          </div>
        </ThemeProvider>
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}

// Helper to get initial props
App.getInitialProps = async ({ Component, ctx }: any) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};
