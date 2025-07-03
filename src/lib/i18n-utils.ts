import { locales, defaultLocale, type Locale } from '../../i18n-config';

/**
 * Checks if the given locale is a valid locale
 * @param locale The locale to check
 * @returns boolean indicating if the locale is valid
 */
export function isValidLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Gets the locale from the URL pathname
 * @param pathname The URL pathname
 * @returns The detected locale or the default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const locale = pathname.split('/')[1];
  return isValidLocale(locale) ? locale : defaultLocale;
}

/**
 * Removes the locale prefix from a pathname
 * @param pathname The URL pathname
 * @returns The pathname without the locale prefix
 */
export function removeLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return pathname.replace(new RegExp(`^/${locale}`), '') || '/';
}

/**
 * Adds a locale prefix to a pathname
 * @param pathname The URL pathname
 * @param locale The target locale
 * @returns The pathname with the locale prefix
 */
export function addLocalePrefix(pathname: string, locale: Locale): string {
  const pathWithoutLocale = removeLocalePrefix(pathname);
  return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}

/**
 * Gets the alternative language URL for the current page
 * @param pathname The current URL pathname
 * @param targetLocale The target locale
 * @returns The URL for the target locale
 */
export function getAlternateUrl(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = removeLocalePrefix(pathname);
  
  // If the target locale is the default locale, we might want to omit it from the URL
  // depending on your routing strategy
  const shouldOmitDefaultLocale = true;
  
  if (targetLocale === defaultLocale && shouldOmitDefaultLocale) {
    return pathWithoutLocale === '/' ? '/' : `/${pathWithoutLocale}`;
  }
  
  return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}

/**
 * Gets the display name of a locale
 * @param locale The locale code
 * @returns The display name of the locale
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية',
  };
  
  return displayNames[locale] || locale;
}

/**
 * Gets the text direction for a locale
 * @param locale The locale code
 * @returns 'rtl' for Arabic, 'ltr' for other languages
 */
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Gets the HTML lang attribute value for a locale
 * @param locale The locale code
 * @returns The HTML lang attribute value
 */
export function getHtmlLang(locale: Locale): string {
  return locale === 'ar' ? 'ar' : 'en';
}
