import { getUser } from '@/lib/database/user/get';
import { User } from '@/types/User';
import { useQuery } from '@tanstack/react-query';

// React Query hook to fetch the user data
export const useGetUser = (userId: string) => {
  return useQuery<User | undefined, Error>({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};
