import { Locale } from '../../i18n-config';

declare module './i18n-utils' {
  export function isValidLocale(locale: string | undefined): locale is Locale;
  export function getLocaleFromPathname(pathname: string): Locale;
  export function removeLocalePrefix(pathname: string): string;
  export function addLocalePrefix(pathname: string, locale: Locale): string;
  export function getAlternateUrl(pathname: string, targetLocale: Locale): string;
  export function getLocaleDisplayName(locale: Locale): string;
  export function getTextDirection(locale: Locale): 'ltr' | 'rtl';
  export function getHtmlLang(locale: Locale): string;
}
