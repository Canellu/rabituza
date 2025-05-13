import {
  ActivityDataType,
  BaseActivityType,
  DrivingDataType,
  RunningDataType,
} from '@/types/Activity';
import {
  collection,
  deleteDoc,
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
    const activityWithRoutes = activityData as (
      | DrivingDataType
      | RunningDataType
    ) &
      BaseActivityType;
    const { routes, ...activityDataWithoutRoutes } = activityWithRoutes;

    // Handle routes as a subcollection if they exist
    if (routes) {
      const globalRoutesRef = collection(globalActivityRef, 'routes');
      const userRoutesRef = collection(userActivityRef, 'routes');

      // Get existing route IDs to track which ones to delete
      const existingRouteIds = new Set(routes.map((route) => route.id));

      // Handle each route
      for (const route of routes) {
        if (!route.id || route.id === 'temp') {
          // Handle new routes
          const routeId = doc(collection(db, 'temp')).id;
          const routeData = {
            id: routeId,
            geolocations: route.geolocations,
            createdAt: serverTimestamp(),
          };

          // Add route to both locations with the same ID
          await Promise.all([
            setDoc(doc(globalRoutesRef, routeId), routeData),
            setDoc(doc(userRoutesRef, routeId), routeData),
          ]);
        }
      }

      // Delete routes that are no longer in the routes array
      const deletePromises = [];
      for (const routeId of existingRouteIds) {
        if (!routes.find((r) => r.id === routeId)) {
          deletePromises.push(
            deleteDoc(doc(globalRoutesRef, routeId)),
            deleteDoc(doc(userRoutesRef, routeId))
          );
        }
      }
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
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
