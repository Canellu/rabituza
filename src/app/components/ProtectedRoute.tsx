'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after the component has mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering protected content until client-side hydration is complete
  if (!isMounted) return null;

  return isLoggedIn ? (
    <main className="min-h-screen">{children}</main>
  ) : (
    <Login />
  );
};

export default ProtectedRoute;
