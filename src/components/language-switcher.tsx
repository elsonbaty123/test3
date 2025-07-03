'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales } from '@/i18n-config';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  currentLocale: string;
}

const languageNames: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
};

export function LanguageSwitcher({ isScrolled = true, currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const changeLanguage = (lng: string) => {
    if (!pathname) return;
    
    // Get the path without the current locale
    const segments = pathname.split('/');
    const pathWithoutLocale = segments.filter(segment => !locales.includes(segment as any)).join('/');
    
    // Redirect to the new URL with the selected language
    router.push(`/${lng}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            'h-10 w-10',
            !isScrolled && 'text-white hover:bg-white/20 hover:text-white',
            'transition-colors duration-300',
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem 
            key={locale}
            onClick={() => changeLanguage(locale)} 
            disabled={currentLocale === locale}
            className={currentLocale === locale ? 'bg-accent' : ''}
          >
            {languageNames[locale] || locale}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
