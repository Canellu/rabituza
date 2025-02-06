// firestore/goals.ts
import { GoalType } from '@/types/Goal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getGoals = async (userId: string): Promise<GoalType[]> => {
  try {
    const goalsRef = collection(db, `users/${userId}/goals`);

    const querySnapshot = await getDocs(goalsRef);
    const goals: GoalType[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description || '',
        status: data.status,
        category: data.category,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        tags: data.tags || [],
        order: data.order ?? 0,
      };
    });

    // Sort goals by order
    return goals.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};
