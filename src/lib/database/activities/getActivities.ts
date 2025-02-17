import {
  ActivityRatingsType,
  ActivityType,
  ActivityTypes,
  CalisthenicsExerciseType,
  GymExerciseType,
  HangboardEdgeType,
  Route,
} from '@/types/Activity';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getActivities = async (
  userId: string
): Promise<ActivityType[]> => {
  try {
    const activitiesRef = collection(db, `users/${userId}/activities`);
    const querySnapshot = await getDocs(activitiesRef);

    const activities = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
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
                  setGroups: exercise.setGroups.map((setGroup) => {
                    const base = {
                      sets: setGroup.sets,
                    };

                    if (setGroup.duration !== undefined) {
                      return {
                        ...base,
                        duration: setGroup.duration,
                        weight: setGroup.weight || 0,
                      };
                    } else {
                      return {
                        ...base,
                        reps: setGroup.reps || 0,
                        weight: setGroup.weight || 0,
                      };
                    }
                  }),
                })
              ),
            };
          case ActivityTypes.Gym:
            return {
              ...baseActivity,
              exercises: data.exercises.map((exercise: GymExerciseType) => ({
                name: exercise.name,
                setGroups: exercise.setGroups.map((setGroup) => {
                  const base = {
                    sets: setGroup.sets,
                  };

                  if (setGroup.duration !== undefined) {
                    return {
                      ...base,
                      duration: setGroup.duration,
                    };
                  } else {
                    return {
                      ...base,
                      reps: setGroup.reps || 0,
                      weight: setGroup.weight || 0,
                    };
                  }
                }),
              })),
            };
          case ActivityTypes.Stretching:
            return {
              ...baseActivity,
              stretches: data.stretches || [],
              duration: data.duration || 0,
            };

          case ActivityTypes.Hangboard:
            return {
              ...baseActivity,
              edges: data.edges.map((edge: HangboardEdgeType) => ({
                size: edge.size,
                sets: edge.sets,
                reps: edge.reps,
                weight: edge.weight || 0,
                duration: edge.duration || 0,
              })),
            };
          case ActivityTypes.Driving:
            const routesCollectionRef = collection(doc.ref, 'routes');
            const routesSnapshot = await getDocs(routesCollectionRef);
            const routes: Route[] = routesSnapshot.docs.map((routeDoc) => ({
              id: routeDoc.id,
              createdAt: routeDoc.data().createdAt.toDate(),
              geolocations: routeDoc.data().geolocations,
            }));

            return {
              ...baseActivity,
              purpose: data.purpose,
              duration: data.duration,
              weatherConditions: data.weatherConditions,
              trafficConditions: data.trafficConditions,
              distance: data.distance,
              status: data.status,
              routes,
            };
          default:
            throw new Error(`Unknown activity type: ${data.type}`);
        }
      })
    );

    return (activities as unknown as ActivityType[]).sort(
      (a, b) => b.activityDate.getTime() - a.activityDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
