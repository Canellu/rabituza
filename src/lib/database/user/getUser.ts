import { User } from '@/types/User';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUser = async (userId: string): Promise<User | undefined> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Safely handle fields that may be undefined
      const user: User = {
        id: userSnap.id,
        code: userData?.code || '', // Default to empty string if not available
        username: userData?.username || '', // Default to empty string if not available
        first_name: userData?.first_name || null, // Allow null for optional fields
        last_name: userData?.last_name || null,
        email: userData?.email || null,
        avatar: userData?.avatar || '', // Default to empty string if not available
        dob:
          userData?.dob && userData.dob.toDate ? userData.dob.toDate() : null, // Handle missing dob
        height: userData?.height || null,
        gender: userData?.gender || null,
        weight: userData?.weight || null,
        bio: userData?.bio || null,
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
