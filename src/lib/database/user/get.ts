import { User } from '@/types/UserProfile';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUser = async (userId: string): Promise<User | undefined> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Convert Firestore Timestamp to JavaScript Date if present
      const dob =
        userData.dob instanceof Timestamp ? userData.dob.toDate() : undefined;

      // Map the Firestore data to the User type
      const user: User = {
        id: userSnap.id,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        dob: dob,
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

// React Query hook to fetch the user data
export const useGetUser = (userId: string) => {
  return useQuery<User | undefined, Error>({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};
