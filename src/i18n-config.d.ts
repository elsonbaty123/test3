// This file is used to provide TypeScript type information for the i18n configuration
declare const locales: readonly ['en', 'ar'];
declare const defaultLocale: 'ar';
type Locale = 'en' | 'ar';

declare function getMessages(locale: string): Promise<Record<string, any>>;
declare function getLocaleFromPathname(pathname: string): string;
declare function getPathnameWithoutLocale(pathname: string): string;
declare function isValidLocale(locale: string | undefined): locale is Locale;
declare function generateStaticParams(): Array<{ locale: Locale }>;
declare function getAvailableLocales(): Array<{ 
  code: Locale; 
  name: string; 
  dir: 'ltr' | 'rtl'; 
  isDefault: boolean;
}>;
declare function localizePath(path: string, targetLocale: Locale, currentLocale?: Locale): string;
declare function getLocaleName(locale: Locale): string;
declare function getTextDirection(locale: Locale): 'ltr' | 'rtl';

export {
  locales,
  defaultLocale,
  Locale,
  getMessages,
  getLocaleFromPathname,
  getPathnameWithoutLocale,
  isValidLocale,
  generateStaticParams,
  getAvailableLocales,
  localizePath,
  getLocaleName,
  getTextDirection
};
