import { createOrUpdateUser } from '@/lib/database/user/createOrUpdate';
import { User } from '@/types/UserProfile';
import { useMutation } from '@tanstack/react-query';

// React Query hook for creating or updating a user
const useCreateOrUpdateUser = () => {
  return useMutation({
    mutationFn: (user: User) => createOrUpdateUser(user),
    onSuccess: () => {
      console.log('User profile successfully saved!');
    },
    onError: (error) => {
      console.error('Error saving user profile:', error);
    },
  });
};

export default useCreateOrUpdateUser;
