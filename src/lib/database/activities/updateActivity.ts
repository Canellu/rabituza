import {
  ActivityDataType,
  BaseActivityType,
  DrivingDataType,
  RunningDataType,
} from '@/types/Activity';
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
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

      // Get existing routes
      const [globalRoutesSnap, userRoutesSnap] = await Promise.all([
        getDocs(globalRoutesRef),
        getDocs(userRoutesRef),
      ]);

      const batch = writeBatch(db);

      // Delete routes that are no longer in the routes array
      const currentRouteIds = routes.map((route) => route.id);
      globalRoutesSnap.docs.forEach((doc) => {
        if (!currentRouteIds.includes(doc.id)) {
          batch.delete(doc.ref);
        }
      });
      userRoutesSnap.docs.forEach((doc) => {
        if (!currentRouteIds.includes(doc.id)) {
          batch.delete(doc.ref);
        }
      });

      // Add new routes that don't have an ID yet
      const newRoutes = routes.filter((route) => !route.id);
      for (const route of newRoutes) {
        const routeId = doc(collection(db, 'temp')).id;
        const routeData = {
          id: routeId,
          geolocations: route.geolocations,
          createdAt: serverTimestamp(),
        };
        batch.set(doc(globalRoutesRef, routeId), routeData);
        batch.set(doc(userRoutesRef, routeId), routeData);
      }

      // Commit all route changes
      await batch.commit();
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
