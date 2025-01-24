'use client';

import { verifyUserCode, verifyUserIdentifier } from '@/lib/auth/verifyLogin';
import { clearSession, getSession } from '@/lib/utils/authSession';
import { User } from '@/types/UserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      queryClient.setQueryData(['user'], session); // Set user in React Query if session exists
    } else {
      // If session has expired or doesn't exist, clear React Query cache and localStorage
      queryClient.removeQueries({ queryKey: ['user'] });
      clearSession();
    }
  }, [queryClient]);

  // Mutation for verifying user identifier
  const verifyIdentifierMutation = useMutation({
    mutationFn: async (identifier: string): Promise<boolean> => {
      setLoading(true);
      const user = await verifyUserIdentifier(identifier);
      return user ? true : false; // Return true if user found, false otherwise
    },
    onSuccess: () => {
      setError(null); // Clear error on success
    },
    onError: (err) => {
      setError(err.message || 'An error occurred while verifying identifier.');
    },
    onSettled: () => {
      setLoading(false); // Clear loading state on success or error
    },
  });

  // Mutation for verifying user code
  const verifyCodeMutation = useMutation({
    mutationFn: async (code: string): Promise<boolean> => {
      setLoading(true);
      const user = queryClient.getQueryData(['user']) as User;
      if (!user) throw new Error('No user found in session.');
      const isCodeValid = await verifyUserCode(user, code);
      return isCodeValid ? true : false; // Return true if code matches, false otherwise
    },
    onSuccess: () => {
      setError(null); // Clear error on success
    },
    onError: (err) => {
      setError(err.message || 'An error occurred while verifying code.');
    },
    onSettled: () => {
      setLoading(false); // Clear loading state on success or error
    },
  });

  // Logout function
  const logout = () => {
    clearSession(); // Clear session from localStorage
    queryClient.removeQueries({ queryKey: ['user'] }); // Clear user data from React Query cache
    router.refresh(); // Refresh the page
  };

  // Check if user is logged in by either checking localStorage or React Query cache
  const isLoggedIn = !!getSession() || !!queryClient.getQueryData(['user']);

  return {
    verifyUserIdentifier: async (identifier: string): Promise<boolean> => {
      return await verifyIdentifierMutation.mutateAsync(identifier);
    },
    verifyUserCode: async (code: string): Promise<boolean> => {
      return await verifyCodeMutation.mutateAsync(code);
    },
    logout,
    isLoggedIn,
    user: queryClient.getQueryData(['user']) as User,
    loading,
    error,
  };
}
