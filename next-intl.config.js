const path = require('path');

/** @type {import('next-intl').NextConfig} */
module.exports = {
  // The default locale that will be used when visiting a non-locale prefixed path
  defaultLocale: 'en',
  
  // An array of all locales that are supported
  locales: ['en', 'ar'],
  
  // The directory where the translation files are located
  localePath: path.resolve('./src/messages'),
  
  // Whether to use the locale prefix for the default locale
  localePrefix: 'as-needed',
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Load the messages synchronously
  loadLocaleFrom: (locale, namespace) => 
    import(`./src/messages/${locale}.json`).then((m) => m.default || m),
}
