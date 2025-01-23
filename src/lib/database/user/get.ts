import { User } from '@/types/UserProfile';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUser = async (userId: string): Promise<User | undefined> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Map the Firestore data to the User type
      const user: User = {
        id: userSnap.id,
        code: userData.code,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        dob: userData.dob.toDate(),
        height: userData.height,
        gender: userData.gender,
        weight: userData.weight,
        bio: userData.bio,
      };

      return user;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
