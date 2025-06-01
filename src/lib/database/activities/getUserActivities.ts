import {
  ActivityRatingsType,
  ActivityType,
  ActivityTypes,
  BaseActivityType,
  HangboardEdgeType,
  Route,
  WorkoutExerciseType,
} from '@/types/Activity';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUserActivities = async (
  userId: string
): Promise<ActivityType[]> => {
  try {
    const activitiesRef = collection(db, `users/${userId}/activities`);
    const querySnapshot = await getDocs(activitiesRef);

    const activities = await Promise.all(
      querySnapshot.docs.map(async (docRef) => {
        const data = docRef.data();

        const baseActivity: BaseActivityType & { type: ActivityType } = {
          id: docRef.id,
          type: data.type as ActivityType,
          userId: data.userId,
          createdAt: data.createdAt.toDate(),
          activityDate: data.activityDate.toDate(),
          ratings: data.ratings as ActivityRatingsType,
          note: data.note || '',
        };

        switch (data.type) {
          case ActivityTypes.Climbing:
            return {
              ...baseActivity,
              gym: data.gym,
              grades: data.grades,
            };
          case ActivityTypes.Workout:
            return {
              ...baseActivity,
              exercises: data.exercises.map(
                (exercise: WorkoutExerciseType) => ({
                  name: exercise.name,
                  setGroups: exercise.setGroups.map((setGroup) => {
                    const base = {
                      sets: setGroup.sets,
                      weight: setGroup.weight || 0,
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
                      };
                    }
                  }),
                })
              ),
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
          case ActivityTypes.Driving: {
            // Added block scope
            const routesCollectionRef = collection(docRef.ref, 'routes');
            const routesSnapshot = await getDocs(routesCollectionRef);
            const routes: Route[] = routesSnapshot.docs
              .map((routeDoc) => ({
                id: routeDoc.id,
                createdAt: routeDoc.data().createdAt?.toDate(),
                geolocations: routeDoc.data().geolocations,
              }))
              .filter(
                (
                  route
                ): route is Route => // Type guard for filtering
                  !!route.geolocations && route.geolocations.length > 0
              );

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
          }
          case ActivityTypes.Running: {
            // Added case for Running
            const routesCollectionRef = collection(docRef.ref, 'routes');
            const routesSnapshot = await getDocs(routesCollectionRef);
            const routes: Route[] = routesSnapshot.docs
              .map((routeDoc) => ({
                id: routeDoc.id,
                createdAt: routeDoc.data().createdAt?.toDate(), // Handle potential undefined createdAt
                geolocations: routeDoc.data().geolocations,
              }))
              .filter(
                (
                  route
                ): route is Route => // Type guard for filtering
                  !!route.geolocations && route.geolocations.length > 0
              );

            return {
              ...baseActivity,
              duration: data.duration,
              distance: data.distance,
              status: data.status,
              routes,
            };
          }
          case ActivityTypes.Swimming:
            if (data.location !== 'pool') {
              const routesCollectionRef = collection(docRef.ref, 'routes');
              const routesSnapshot = await getDocs(routesCollectionRef);
              const routes: Route[] = routesSnapshot.docs
                .map((routeDoc) => ({
                  id: routeDoc.id,
                  createdAt: routeDoc.data().createdAt?.toDate(),
                  geolocations: routeDoc.data().geolocations,
                }))
                .filter(
                  (
                    route
                  ): route is Route => // Type guard for filtering
                    !!route.geolocations && route.geolocations.length > 0
                );

              return {
                ...baseActivity,
                duration: data.duration,
                distance: data.distance,
                status: data.status,
                location: data.location,
                routes,
              };
            }

            return {
              ...baseActivity,
              duration: data.duration,
              distance: data.distance,
              status: data.status,
              location: data.location,
              poolLength: data.poolLength,
              strokes: data.strokes,
            };
          default:
            // Consider handling unknown types more gracefully or logging them
            console.warn(`Unknown activity type encountered: ${data.type}`);
            // Return baseActivity or null/undefined if unknown types should be excluded
            return baseActivity; // Or handle as needed
          // throw new Error(`Unknown activity type: ${data.type}`);
        }
      })
    );

    // Filter out any potential null/undefined values if unknown types aren't returned
    const validActivities = activities.filter(
      Boolean
    ) as unknown as ActivityType[];

    return validActivities.sort(
      (a, b) => b.activityDate.getTime() - a.activityDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};
