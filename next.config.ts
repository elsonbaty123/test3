import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add support for @/ path alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Handle environment variables
    config.plugins.push(
      new (require('webpack')).DefinePlugin({
        'process.env.NEXT_PUBLIC_ENV': JSON.stringify(process.env.NODE_ENV),
      })
    );
    
    return config;
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  optimizeFonts: true,
};

// Create a plugin instance
const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts'
);

export default withNextIntl(nextConfig);
