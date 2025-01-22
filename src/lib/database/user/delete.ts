import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('User profile deleted!');
  } catch (error) {
    console.error('Error deleting user profile:', error);
  }
};
