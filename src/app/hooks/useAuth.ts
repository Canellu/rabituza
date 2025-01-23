'use client';

import verifyLogin from '@/lib/auth/verifyLogin';
import {
  clearSession,
  getSession,
  storeSession,
} from '@/lib/utils/authSession';
import { User } from '@/types/UserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginCredentials {
  identifier: string; // Email or username
  code: string; // 6-digit code
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      queryClient.setQueryData(['user'], session);
    }
  }, [queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const user = await verifyLogin(credentials.identifier, credentials.code);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user); // Store user in React Query cache
      storeSession(user); // Store session in localStorage
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  // Logout function
  const logout = () => {
    clearSession();
    queryClient.removeQueries({ queryKey: ['user'] }); // Clear user data from React Query
    router.refresh();
  };

  return {
    login: (credentials: LoginCredentials) => {
      setLoading(true);
      loginMutation.mutate(credentials, {
        onSettled: () => {
          setLoading(false);
          router.refresh();
        },
      });
    },
    logout,
    isLoggedIn: !!getSession(), // Check if session exists
    user: queryClient.getQueryData(['user']) as User, // Get the current user from React Query cache
    loading,
    error,
  };
}
