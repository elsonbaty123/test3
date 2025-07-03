import { Locale } from '../../i18n-config';

declare module 'next' {
  interface NextPageProps {
    params: {
      locale: Locale;
    };
  }
}

declare module 'next/navigation' {
  interface LinkProps {
    href: `/${string}` | `#${string}` | '';
    locale?: Locale | false;
  }
}

declare module 'next-intl' {
  interface IntlMessages {
    common: typeof import('../../messages/en/common.json');
    home: typeof import('../../messages/en/home.json');
    notFound: typeof import('../../messages/en/not-found.json');
    error: typeof import('../../messages/en/error.json');
    // Add other namespaces as needed
  }
}
