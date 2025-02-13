'use client';

import { getSession } from '@/lib/utils/userSession';
import { ReactNode, useEffect, useState } from 'react';
import Login from './Login';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const userId = getSession();
  // const { data, isLoading, isError } = useFoods(); // Fetch food data here

  // Ensure component renders only after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent rendering before hydration
  if (!isMounted) return null;

  // Show login screen if user is not logged in
  if (!userId) return <Login />;

  // // Handle loading/error states but don't block rendering the rest of the app
  // if (isLoading) {
  //   // Optionally show a small loading spinner or indicator somewhere
  //   console.log('Foods are loading in the background...');
  // }

  // if (isError) {
  //   console.error('Error loading foods!');
  // }

  // Main content - continue rendering regardless of food loading status
  return (
    <main className="min-h-dvh">
      {children}
      {/* Optionally, you can pass `data` to children if needed */}
    </main>
  );
};

export default ProtectedRoute;
