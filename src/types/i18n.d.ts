// Type declarations for i18n configuration
declare module '@/i18n-config' {
  export const locales: readonly ['en', 'ar'];
  export const defaultLocale: 'ar';
  export type Locale = 'en' | 'ar';
  
  export interface Messages {
    [key: string]: string | Messages;
  }

  export function getMessages(locale: string): Promise<Messages>;
  export function getLocaleFromPathname(pathname: string): string;
  export function getPathnameWithoutLocale(pathname: string): string;
  export function isValidLocale(locale: string | undefined): locale is Locale;
  export function generateStaticParams(): Array<{ locale: Locale }>;
  export function getAvailableLocales(): Array<{ 
    code: Locale; 
    name: string; 
    dir: 'ltr' | 'rtl'; 
    isDefault: boolean;
  }>;
  export function localizePath(path: string, targetLocale: Locale, currentLocale?: Locale): string;
  export function getLocaleName(locale: Locale): string;
  export function getTextDirection(locale: Locale): 'ltr' | 'rtl';
}
