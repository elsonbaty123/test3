'use client';

import { useI18n } from '../hooks/useI18n';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, availableLocales, changeLocale } = useI18n();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLocales.map(({ code, name, isCurrent }) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => changeLocale(code)}
            className={isCurrent ? 'bg-accent' : ''}
            disabled={isCurrent}
          >
            <span className={`flex-1 ${isCurrent ? 'font-semibold' : ''}`}>
              {name}
            </span>
            {isCurrent && (
              <span className="ml-2 text-xs text-muted-foreground">
                •
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
