'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

// Add custom theme types
type Theme = 'light' | 'dark' | 'system';

// Create a context for theme
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props 
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme: currentTheme, setTheme } = useNextTheme();
  
  // Only render the theme provider after mounting to avoid hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if the current theme is dark
  const isDark = React.useMemo(() => {
    if (!mounted) return false;
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return currentTheme === 'dark';
  }, [currentTheme, mounted]);

  // Toggle between light and dark theme
  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      theme: currentTheme as Theme,
      setTheme,
      isDark,
      toggleTheme,
    }),
    [currentTheme, setTheme, isDark, toggleTheme]
  );

  // Don't render anything until we're on the client
  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

// Theme toggle button component
export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <span className="h-5 w-5">🌞</span>
      ) : (
        <span className="h-5 w-5">🌙</span>
      )}
    </button>
  );
}
