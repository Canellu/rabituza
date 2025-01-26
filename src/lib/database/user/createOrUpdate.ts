import { User } from '@/types/UserProfile';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Function to create or update user in Firestore
export const createOrUpdateUser = async (user: User): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (error) {
    throw error;
  }
};
