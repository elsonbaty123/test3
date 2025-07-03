import { notFound } from 'next/navigation';

// Supported languages
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar' as const;
export type Locale = (typeof locales)[number];

// Type for the messages structure
export type Messages = {
  [key: string]: string | Messages;
} & {
  // Add common message keys here for better type safety
  home?: {
    welcome: string;
    description: string;
    greeting: (params: { name: string }) => string;
    features: {
      title: string;
      [key: string]: string;
    };
    cta: {
      learnMore: string;
    };
  };
};

// Language display names
const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
} as const;

// Text directions
const textDirections: Record<Locale, 'rtl' | 'ltr'> = {
  en: 'ltr',
  ar: 'rtl',
} as const;

// Validate if a string is a valid locale
export function isValidLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}

// الحصول على اللغة من مسار الصفحة
// Get the locale from the pathname
export function getLocaleFromPathname(pathname: string): string {
  const locale = pathname.split('/')[1];
  return isValidLocale(locale) ? locale : defaultLocale;
}

// الحصول على مسار الصفحة بدون اللغة
// Get the pathname without the locale
export function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return pathname.replace(new RegExp(`^/${locale}`), '') || '/';
}

// جلب رسائل لغة معينة
// Get messages for a specific locale
export async function getMessages(locale: string): Promise<Messages> {
  try {
    // In a production environment, you might want to use fetch to get the messages
    // from the public directory or an API endpoint
    const response = await fetch(`/locales/${locale}/common.json`);
    if (!response.ok) {
      throw new Error(`Failed to load messages for locale: ${locale}`);
    }
    const messages = await response.json();
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Return empty messages object as fallback
    return {};
  }
}

// الحصول على اسم اللغة المعروض
// Get the display name of a locale
export function getLocaleName(locale: string): string {
  return localeNames[locale as Locale] || locale;
}

// الحصول على اتجاه النص للغة
// Get the text direction for a locale
export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  return textDirections[locale as Locale] || 'ltr';
}

// إنشاء مسارات ثابتة للغات
// Generate static paths for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

// الحصول على اللغات المتاحة مع معلوماتها
// Get available locales with their information
export function getAvailableLocales() {
  return locales.map((locale) => ({
    code: locale,
    name: localeNames[locale],
    dir: textDirections[locale],
    isRTL: textDirections[locale] === 'rtl',
  }));
}

// تحويل مسار الصفحة إلى اللغة المطلوبة
// Convert a path to a specific locale
export function localizePath(path: string, targetLocale: string, currentLocale?: string): string {
  // إزالة البادئة الحالية للغة
  // Remove current locale prefix if exists
  if (currentLocale) {
    path = path.replace(new RegExp(`^/${currentLocale}`), '');
  }

  // إضافة اللغة الجديدة إذا لم تكن الافتراضية
  // Add new locale prefix if not the default locale
  if (targetLocale !== defaultLocale) {
    path = `/${targetLocale}${path}`;
  }

  return path || '/';
}
