'use client';

import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const QueryDevToolsEnabled =
    process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS === 'true';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {QueryDevToolsEnabled && <ReactQueryDevtools initialIsOpen={false} />}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
