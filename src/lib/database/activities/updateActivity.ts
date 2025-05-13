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
  getDocs,
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

  if (activityData.type === 'driving' || activityData.type === 'running') {
    const activityWithRoutes = activityData as (
      | DrivingDataType
      | RunningDataType
    ) &
      BaseActivityType;

    const { routes, ...activityDataWithoutRoutes } = activityWithRoutes;

    const globalRoutesRef = collection(globalActivityRef, 'routes');
    const userRoutesRef = collection(userActivityRef, 'routes');

    // Get existing routes from both collections
    const [globalRoutesSnap, userRoutesSnap] = await Promise.all([
      getDocs(globalRoutesRef),
      getDocs(userRoutesRef),
    ]);

    const existingRouteIds = new Set([
      ...globalRoutesSnap.docs.map(doc => doc.id),
      ...userRoutesSnap.docs.map(doc => doc.id),
    ]);

    const currentRouteIds = new Set<string>();
    const savePromises: Promise<void>[] = [];

    if (routes?.length) {
      for (const route of routes) {
        let routeId = route.id;
        
        // Generate new ID only for temp/new routes
        if (!routeId || routeId === 'temp') {
          routeId = doc(collection(db, 'temp')).id;
        }

        currentRouteIds.add(routeId);

        // Only create new documents for routes that don't exist
        if (!existingRouteIds.has(routeId)) {
          const routeData = {
            id: routeId,
            geolocations: route.geolocations,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          savePromises.push(
            setDoc(doc(globalRoutesRef, routeId), routeData),
            setDoc(doc(userRoutesRef, routeId), routeData)
          );
        } else {
          // Update existing routes without overwriting createdAt
          const updateData = {
            geolocations: route.geolocations,
            updatedAt: serverTimestamp(),
          };

          savePromises.push(
            updateDoc(doc(globalRoutesRef, routeId), updateData),
            updateDoc(doc(userRoutesRef, routeId), updateData)
          );
        }
      }

      if (savePromises.length > 0) {
        await Promise.all(savePromises);
      }
    }

    // Delete routes not present in current list
    const deletePromises: Promise<void>[] = [];
    for (const routeId of existingRouteIds) {
      if (!currentRouteIds.has(routeId)) {
        deletePromises.push(
          deleteDoc(doc(globalRoutesRef, routeId)),
          deleteDoc(doc(userRoutesRef, routeId))
        );
      }
    }

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }

    // Update main activity document
    const updateData = {
      ...activityDataWithoutRoutes,
      updatedAt: serverTimestamp(),
    };
    await Promise.all([
      updateDoc(globalActivityRef, updateData),
      updateDoc(userActivityRef, updateData),
    ]);
  } else {
    // Non-route activity
    const updateData = {
      ...activityData,
      updatedAt: serverTimestamp(),
    };
    await Promise.all([
      updateDoc(globalActivityRef, updateData),
      updateDoc(userActivityRef, updateData),
    ]);
  }
}
