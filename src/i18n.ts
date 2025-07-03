import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the locales that your app supports
export const locales = ['en', 'ar'] as const;
type Locale = (typeof locales)[number];

// Type guard to validate locale
function isValidLocale(locale: string | undefined): locale is Locale {
  return typeof locale === 'string' && (locales as readonly string[]).includes(locale);
}

// Helper function to get messages with proper typing
async function loadMessages(locale: string | undefined) {
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  try {
    const messages = await import(`../messages/${locale}.json`);
    return {
      locale,
      messages: messages.default || messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
}

// Export the configuration
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    notFound();
  }
  return loadMessages(locale);
});
