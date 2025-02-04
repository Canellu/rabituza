import { Activity, ActivityType } from '@/types/Activity';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getActivities = async (userId: string): Promise<Activity[]> => {
  try {
    const activitiesRef = collection(db, `users/${userId}/activities`);
    const querySnapshot = await getDocs(activitiesRef);

    const activities = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Base activity data
      const baseActivity = {
        id: doc.id,
        type: data.type as ActivityType,
        userId,
        createdAt: data.createdAt.toDate(),
        activityDate: data.activityDate.toDate(),
      };

      // Add type-specific fields
      switch (data.type) {
        case ActivityType.Bouldering:
          return {
            ...baseActivity,
            gym: data.gym,
            grades: data.grades,
          };
        case ActivityType.Gym:
          return {
            ...baseActivity,
            // Add gym-specific fields when implemented
          };
        case ActivityType.Calisthenics:
          return {
            ...baseActivity,
            // Add calisthenics-specific fields when implemented
          };
        case ActivityType.Stretching:
          return {
            ...baseActivity,
            // Add stretching-specific fields when implemented
          };
        default:
          throw new Error(`Unknown activity type: ${data.type}`);
      }
    });

    return (activities as Activity[]).sort(
      (a, b) => b.activityDate.getTime() - a.activityDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
