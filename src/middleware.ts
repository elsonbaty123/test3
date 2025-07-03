import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n-config';
import { pathnames } from './navigation';

// Define the middleware configuration
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],
  
  // Used when no locale matches
  defaultLocale: defaultLocale as string,
  
  // Pathnames to match for internationalization
  pathnames: pathnames as Record<string, string | Record<string, string>>,
  
  // Don't redirect the default locale
  localePrefix: 'as-needed',
  
  // Enable automatic locale detection
  localeDetection: true,

  // Define alternate links for SEO
  alternateLinks: true,

  // Define the domains for each locale (if using domain-based routing)
  // domains: [
  //   {
  //     domain: 'example.com',
  //     defaultLocale: 'en',
  //   },
  //   {
  //     domain: 'example.ae',
  //     defaultLocale: 'ar',
  //   },
  // ],
});

export default intlMiddleware;

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|json)$).*)',
  ],
};
