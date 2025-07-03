import { Locale } from '../i18n-config';

// Define the pathnames for each route in each language
export const pathnames = {
  // Homepage
  '/': '/',
  
  // Authentication
  '/login': {
    en: '/login',
    ar: '/تسجيل-الدخول',
  },
  '/register': {
    en: '/register',
    ar: '/تسجيل-حساب-جديد',
  },
  
  // User profile
  '/profile': {
    en: '/profile',
    ar: '/الملف-الشخصي',
  },
  
  // Categories
  '/categories': {
    en: '/categories',
    ar: '/الفئات',
  },
  
  // Search
  '/search': {
    en: '/search',
    ar: '/بحث',
  },
  
  // Cart
  '/cart': {
    en: '/cart',
    ar: '/سلة-التسوق',
  },
  
  // Checkout
  '/checkout': {
    en: '/checkout',
    ar: '/إتمام-الشراء',
  },
  
  // Orders
  '/orders': {
    en: '/orders',
    ar: '/الطلبات',
  },
  
  // Contact
  '/contact': {
    en: '/contact',
    ar: '/اتصل-بنا',
  },
  
  // About
  '/about': {
    en: '/about',
    ar: '/من-نحن',
  },
  
  // Terms and conditions
  '/terms': {
    en: '/terms',
    ar: '/الشروط-والأحكام',
  },
  
  // Privacy policy
  '/privacy': {
    en: '/privacy',
    ar: '/سياسة-الخصوصية',
  },
} as const;

// Type for the pathnames
export type AppPathnames = keyof typeof pathnames;
