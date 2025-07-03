import { createTranslator } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/config';

export type { AbstractIntlMessages } from 'next-intl';

// This function runs only on the server side
export default getRequestConfig(async ({ locale: _locale }) => {
  // Ensure locale is a string and validate it
  const locale = typeof _locale === 'string' ? _locale : defaultLocale;
  
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Africa/Cairo',
    now: new Date(),
  };
});

// Helper function to get translations in server components
export async function getTranslations(locale: string, namespace?: string) {
  const messages = (await import(`../messages/${locale}.json`)).default;
  return createTranslator({
    locale,
    messages,
    namespace,
  });
}

// Helper function to get translated text in server components
export async function getTranslation(
  locale: string, 
  key: string, 
  values?: Record<string, any>
) {
  const t = await getTranslations(locale);
  return t(key, values);
}
