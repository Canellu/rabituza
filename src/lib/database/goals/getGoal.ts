import { GoalType } from '@/types/Goal';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getGoal = async (
  userId: string,
  goalId: string
): Promise<GoalType | null> => {
  try {
    const goalRef = doc(db, `users/${userId}/goals`, goalId);
    const goalSnap = await getDoc(goalRef);

    if (goalSnap.exists()) {
      // Map Firestore document to Goal type, converting Timestamps to JavaScript Dates
      const goalData = goalSnap.data();
      const goal: GoalType = {
        title: goalData.title,
        description: goalData.description || '',
        status: goalData.status,
        category: goalData.category,
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
        tags: goalData.tags || [],
        order: goalData.order ?? 0, // Add order with default value 0
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
