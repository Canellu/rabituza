import { Goal } from '@/types/Goal';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getGoal = async (
  userId: string,
  goalId: string
): Promise<Goal | null> => {
  try {
    const goalRef = doc(db, `users/${userId}/goals`, goalId);
    const goalSnap = await getDoc(goalRef);

    if (goalSnap.exists()) {
      // Map Firestore document to Goal type, converting Timestamps to JavaScript Dates
      const goalData = goalSnap.data();
      const goal: Goal = {
        title: goalData.title, // Ensure 'title' is mapped
        description: goalData.description || '', // Default to empty string if not available
        status: goalData.status, // Ensure 'status' is mapped
        category: goalData.category, // Ensure 'category' is mapped
        startDate:
          goalData.startDate instanceof Timestamp
            ? goalData.startDate.toDate()
            : goalData.startDate,
        endDate:
          goalData.endDate instanceof Timestamp
            ? goalData.endDate.toDate()
            : goalData.endDate,
        createdAt:
          goalData.createdAt instanceof Timestamp
            ? goalData.createdAt.toDate()
            : goalData.createdAt,
        tags: goalData.tags || [], // Default to empty array if no tags
      };
      return goal;
    } else {
      console.log('Goal not found!');
      return null; // Goal doesn't exist
    }
  } catch (error) {
    console.error('Error fetching goal:', error);
    throw error;
  }
};
