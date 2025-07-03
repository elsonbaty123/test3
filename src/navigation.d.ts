import { Locale } from '../i18n-config';

declare module './navigation' {
  export const pathnames: {
    [key: string]: 
      | string 
      | { [key in Locale]?: string } 
      | ((params: Record<string, string | number>) => string);
  };
  
  export type AppPathnames = keyof typeof pathnames;
}
