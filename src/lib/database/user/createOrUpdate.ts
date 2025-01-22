import { User } from '@/types/UserProfile';
import { useMutation } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Function to create or update user in Firestore
export const createOrUpdateUser = async (user: User): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', user.id), user.profileData, { merge: true });
    console.log('User profile successfully saved!');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// React Query hook for creating or updating a user
export const useCreateOrUpdateUser = () => {
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
