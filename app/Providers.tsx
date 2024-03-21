'use client';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TailwindIndicator } from '@/src/TailwindIndicator';

export default function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <TailwindIndicator />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
