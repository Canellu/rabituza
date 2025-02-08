import {
  ActivityRatingsType,
  ActivityType,
  ActivityTypes,
  CalisthenicsExerciseType,
} from '@/types/Activity';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getActivities = async (
  userId: string
): Promise<ActivityType[]> => {
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
        ratings: data.ratings as ActivityRatingsType,
        note: data.note || '',
      };

      // Add type-specific fields
      switch (data.type) {
        case ActivityTypes.Climbing:
          return {
            ...baseActivity,
            gym: data.gym,
            grades: data.grades,
          };
        case ActivityTypes.Calisthenics:
          return {
            ...baseActivity,
            exercises: data.exercises.map(
              (exercise: CalisthenicsExerciseType) => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight || 0,
              })
            ),
          };
        case ActivityTypes.Gym:
          return {
            ...baseActivity,
            // Add gym-specific fields when implemented
          };
        case ActivityTypes.Stretching:
          return {
            ...baseActivity,
            stretches: data.stretches || [], // Extract stretches
            duration: data.duration || 0, // Extract duration
          };
        default:
          throw new Error(`Unknown activity type: ${data.type}`);
      }
    });

    return (activities as unknown as ActivityType[]).sort(
      (a, b) => b.activityDate.getTime() - a.activityDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
