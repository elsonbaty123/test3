import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix, pathnames } from './config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],
  
  // Used when no locale matches
  defaultLocale: defaultLocale,
  
  // Pathnames to use for localized routes
  pathnames: pathnames,
  
  // Whether to use a prefix for the default locale
  localePrefix: localePrefix as 'always' | 'as-needed' | 'never',
  
  // Disable automatic locale detection, we'll handle it manually
  localeDetection: false,
});

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
