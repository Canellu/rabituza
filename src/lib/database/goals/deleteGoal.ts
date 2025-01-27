import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const deleteGoal = async (
  userId: string,
  goalId: string
): Promise<void> => {
  try {
    const goalRef = doc(db, `users/${userId}/goals`, goalId);
    await deleteDoc(goalRef);
    console.log('Goal deleted successfully!');
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
