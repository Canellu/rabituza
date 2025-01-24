'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component renders only after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent rendering before hydration
  if (!isMounted) return null;

  // Conditionally render login or protected content
  return isLoggedIn ? (
    <main className="min-h-screen">{children}</main>
  ) : (
    <Login />
  );
};

export default ProtectedRoute;
