import { Goal } from '@/types/Goal';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const createOrUpdateGoal = async (
  userId: string,
  goalId: string | null,
  goalData: Goal
): Promise<void> => {
  try {
    // Convert startDate and endDate to Firestore Timestamps if they are JavaScript Date objects
    const goalDataWithTimestamps = {
      ...goalData,
      startDate:
        goalData.startDate instanceof Date
          ? Timestamp.fromDate(goalData.startDate)
          : goalData.startDate,
      endDate:
        goalData.endDate instanceof Date
          ? Timestamp.fromDate(goalData.endDate)
          : goalData.endDate,
      updatedAt: serverTimestamp(), // Set or update the `updatedAt` timestamp
    };

    // If goalId is provided, update the existing goal
    if (goalId) {
      const goalRef = doc(db, `users/${userId}/goals`, goalId);
      await updateDoc(goalRef, goalDataWithTimestamps);
      console.log('Goal updated successfully!');
    } else {
      // If no goalId, create a new goal
      const goalRef = doc(collection(db, `users/${userId}/goals`));
      await setDoc(goalRef, {
        ...goalDataWithTimestamps,
        createdAt: serverTimestamp(), // Set the `createdAt` timestamp for the new goal
      });
      console.log('Goal created successfully!');
    }
  } catch (error) {
    console.error('Error creating or updating goal:', error);
    throw error;
  }
};
