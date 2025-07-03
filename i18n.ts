import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the locales that your app supports
export const locales = ['en', 'ar'] as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
