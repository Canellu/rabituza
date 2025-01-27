// firestore/goals.ts
import { Goal } from '@/types/Goal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getGoals = async (userId: string): Promise<Goal[]> => {
  try {
    const goalsRef = collection(db, `users/${userId}/goals`);

    // Fetch all goals for the user without filtering by date
    const querySnapshot = await getDocs(goalsRef);
    const goals: Goal[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Include Firestore document ID here
        title: data.title,
        description: data.description || '',
        status: data.status,
        category: data.category,
        startDate: data.startDate.toDate(), // Convert Firestore Timestamps to JS Dates
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        tags: data.tags || [],
      };
    });

    return goals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};
