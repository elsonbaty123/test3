const createNextIntlPlugin = require('next-intl/plugin');

// Create the plugin with the path to the i18n configuration
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the default Next.js i18n behavior since we're using next-intl
  i18n: undefined,
  
  // Other Next.js config options can go here
};

// Apply the next-intl plugin to the Next.js config
module.exports = withNextIntl(nextConfig);
