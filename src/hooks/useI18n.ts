'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useLocale, useTranslations as useNextIntlTranslations } from 'next-intl';
import { Locale } from '../../i18n-config';
import { 
  getAlternateUrl, 
  getLocaleDisplayName, 
  getTextDirection, 
  getHtmlLang 
} from '../lib/i18n-utils';

/**
 * Custom hook for handling internationalization
 */
export function useI18n() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  
  /**
   * Changes the current locale
   * @param newLocale The new locale to switch to
   */
  const changeLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    
    const newUrl = getAlternateUrl(pathname, newLocale);
    router.push(newUrl);
  }, [locale, pathname, router]);
  
  /**
   * Gets the URL for a specific locale
   * @param targetLocale The target locale
   * @returns The URL for the target locale
   */
  const getLocalizedUrl = useCallback((targetLocale: Locale) => {
    return getAlternateUrl(pathname, targetLocale);
  }, [pathname]);
  
  return {
    // Current locale
    locale,
    
    // Get display name of current locale
    localeDisplayName: getLocaleDisplayName(locale),
    
    // Text direction for current locale
    textDirection: getTextDirection(locale),
    
    // HTML lang attribute for current locale
    htmlLang: getHtmlLang(locale),
    
    // Change the current locale
    changeLocale,
    
    // Get URL for a specific locale
    getLocalizedUrl,
    
    // Get all available locales with their display names
    availableLocales: (['en', 'ar'] as const).map(code => ({
      code,
      name: getLocaleDisplayName(code),
      isCurrent: code === locale,
    })),
  };
}

/**
 * Custom hook for using translations with TypeScript support
 * @param namespace The translation namespace to use
 * @returns Translation function for the given namespace
 */
export function useTranslations<T extends keyof IntlMessages>(namespace: T) {
  return useNextIntlTranslations(namespace);
}

// Type for the messages structure
export interface IntlMessages {
  common: typeof import('../../messages/en/common.json');
  home: typeof import('../../messages/en/home.json');
  notFound: typeof import('../../messages/en/not-found.json');
  error: typeof import('../../messages/en/error.json');
  // Add other namespaces as needed
}
