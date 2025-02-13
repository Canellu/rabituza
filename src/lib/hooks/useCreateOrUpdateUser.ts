import { createOrUpdateUser } from '@/lib/database/user/createOrUpdateUser';
import { User } from '@/types/User';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// React Query hook for creating or updating a user
const useCreateOrUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => createOrUpdateUser(user),
    onSuccess: () => {
      console.log('User profile successfully saved!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Successfully saved to profile.', {
        position: 'top-left',
      });
    },
    onError: (error) => {
      console.error('Error saving user profile:', error);
    },
  });
};

export default useCreateOrUpdateUser;
