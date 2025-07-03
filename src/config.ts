import { notFound } from 'next/navigation';

export const defaultLocale = 'en' as const;
export const locales = ['en', 'ar'] as const;

export const localePrefix = 'as-needed'; // Options: 'always' | 'as-needed' | 'never'

export type Locale = (typeof locales)[number];

// Pathname internationalization options
export const pathnames = {
  // Localized paths
  '/': '/',
  '/chefs': {
    en: '/chefs',
    ar: '/chefs',
  },
  // Add more paths as needed
};

// Helper function to check if a locale is valid
export function isValidLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}

// Get the current locale from the pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  return isValidLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

// Add pathname helper for navigation
export function getPathnameWithLocale(pathname: string, locale: Locale): string {
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
  return `/${locale}${pathnameWithoutLocale}`;
}
