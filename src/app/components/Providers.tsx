'use client';

import { Toaster } from '@/components/ui/sonner';
import { registerServiceWorker } from '@/lib/serviceWorkerRegistration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

const queryClient = new QueryClient();
//   {
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes cache
//     },
//   },
// }

export const Providers = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const QueryDevToolsEnabled =
    process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS === 'true';

  useEffect(() => {
    setMounted(true);
    registerServiceWorker();
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
