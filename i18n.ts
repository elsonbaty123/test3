import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale, isValidLocale, getMessages, type Locale, type Messages } from './i18n-config';

// Re-export the locales and types for easier imports
export { locales };
export type { Locale, Messages } from './i18n-config';

// Extend the Next.js request type to include the locale
declare module 'next' {
  interface NextRequest {
    nextUrl: {
      locale?: Locale;
    };
  }
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    console.error(`Invalid locale: ${locale}`);
    notFound();
  }

  try {
    const messages = await getMessages(locale);
    
    if (!messages) {
      console.error(`No messages found for locale: ${locale}`);
      notFound();
    }

    return {
      locale,
      messages,
      now: new Date(),
      timeZone: 'Asia/Riyadh',
      // Add any default formats here
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        },
        number: {
          currency: {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      },
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});

// Helper function to get the current locale from the request
export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const locale = url.pathname.split('/')[1];
  return isValidLocale(locale) ? locale : defaultLocale;
}
