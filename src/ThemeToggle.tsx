'use client';

import { Button } from '@/src/components/ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="h-6 w-6 dark:hidden" />
      <MoonIcon className="hidden h-6 w-6 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
