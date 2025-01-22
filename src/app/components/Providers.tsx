'use client';

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  const QueryDevToolsEnabled =
    process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS === 'true';

  return (
    <KindeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {QueryDevToolsEnabled && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </KindeProvider>
  );
};
