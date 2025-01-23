'use client';

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <main className="min-h-screen">{children}</main>
  ) : (
    <Login />
  );
};

export default ProtectedRoute;
