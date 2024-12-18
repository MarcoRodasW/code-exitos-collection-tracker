'use client';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import * as React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
