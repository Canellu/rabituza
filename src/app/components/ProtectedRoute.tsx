'use client';

import { getSession } from '@/lib/utils/userSession';
import { ReactNode, useEffect, useState } from 'react';
import Login from './Login';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const userId = getSession();

  // Ensure component renders only after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Prevent rendering before hydration
  if (!isMounted) return null;

  // Conditionally render login or protected content
  return !userId ? (
    <Login />
  ) : (
    <main className="min-h-dvh bg-stone-100 dark:bg-stone-900">{children}</main>
  );
};

export default ProtectedRoute;
