import {
  ActivityDataType,
  BaseActivityType,
  DrivingDataType,
  RunningDataType, // Import RunningDataType
} from '@/types/Activity';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function updateActivity<
  T extends ActivityDataType &
    Pick<BaseActivityType, 'ratings' | 'activityDate' | 'note'>
>(userId: string, activityId: string, activityData: T) {
  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  // Check if the activity type is driving or running
  if (activityData.type === 'driving' || activityData.type === 'running') {
    // Use a union type for assertion
    const activityWithRoutes = activityData as (
      | DrivingDataType
      | RunningDataType
    ) &
      BaseActivityType;
    const { routes, ...activityDataWithoutRoutes } = activityWithRoutes;

    // Handle routes as a subcollection if they exist
    if (routes && routes.length > 0) {
      const globalRoutesRef = collection(globalActivityRef, 'routes');
      const userRoutesRef = collection(userActivityRef, 'routes');

      // Assuming the update adds a single new route segment
      const newRoute = routes[0];
      const routeId = doc(collection(db, 'temp')).id;

      // Add route to both locations with the same ID
      await Promise.all([
        setDoc(doc(globalRoutesRef, routeId), {
          id: routeId,
          geolocations: newRoute.geolocations,
          createdAt: serverTimestamp(),
        }),
        setDoc(doc(userRoutesRef, routeId), {
          id: routeId,
          geolocations: newRoute.geolocations,
          createdAt: serverTimestamp(),
        }),
      ]);
    }

    // Update main documents without routes
    const updateData = {
      ...activityDataWithoutRoutes,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(globalActivityRef, updateData);
    await updateDoc(userActivityRef, updateData);
  } else {
    // For other activities, just update the activity data
    const updateData = {
      ...activityData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(globalActivityRef, updateData);
    await updateDoc(userActivityRef, updateData);
  }
}
