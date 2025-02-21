import { User } from '@/types/User';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const users: User[] = usersSnapshot.docs.map((doc) => {
      const userData = doc.data();
      return {
        id: doc.id,
        code: userData?.code || '',
        username: userData?.username || '',
        first_name: userData?.first_name || null,
        last_name: userData?.last_name || null,
        email: userData?.email || null,
        avatar: userData?.avatar || '',
        dob:
          userData?.dob && userData.dob.toDate ? userData.dob.toDate() : null,
        height: userData?.height || null,
        gender: userData?.gender || null,
        weight: userData?.weight || null,
        bio: userData?.bio || null,
      };
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
