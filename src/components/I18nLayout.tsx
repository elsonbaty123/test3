'use client';

import { ReactNode, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { cn } from '../lib/utils';

interface I18nLayoutProps {
  children: ReactNode;
  className?: string;
}

export function I18nLayout({ children, className }: I18nLayoutProps) {
  const { textDirection, htmlLang } = useI18n();
  
  // Update the HTML direction and language attributes when the locale changes
  useEffect(() => {
    document.documentElement.dir = textDirection;
    document.documentElement.lang = htmlLang;
  }, [textDirection, htmlLang]);
  
  return (
    <div 
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        textDirection === 'rtl' ? 'rtl' : 'ltr',
        className
      )}
      dir={textDirection}
    >
      {children}
    </div>
  );
}
