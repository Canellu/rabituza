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

    // Fetch current routes in the database
    const [globalRoutesSnap, userRoutesSnap] = await Promise.all([
      getDocs(globalRoutesRef),
      getDocs(userRoutesRef),
    ]);

    const existingRouteIds = new Set(
      globalRoutesSnap.docs.map((doc) => doc.id)
    );

    const currentRouteIds = new Set<string>();
    const savePromises: Promise<void>[] = [];

    if (routes && routes.length > 0) {
      for (const route of routes) {
        let routeId = route.id;

        // If route ID is missing or temporary, generate new one
        if (!routeId || routeId === 'temp') {
          routeId = doc(collection(db, 'temp')).id;
        }

        currentRouteIds.add(routeId);

        const routeData = {
          id: routeId,
          geolocations: route.geolocations,
          createdAt: serverTimestamp(),
        };

        // Only save if it's a new route (not in DB yet)
        if (!existingRouteIds.has(routeId)) {
          savePromises.push(
            setDoc(doc(globalRoutesRef, routeId), routeData),
            setDoc(doc(userRoutesRef, routeId), routeData)
          );
        }
      }

      if (savePromises.length > 0) {
        await Promise.all(savePromises);
      }
    }

    // Identify and delete routes that are no longer present
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

    // Update main activity documents
    const updateData = {
      ...activityDataWithoutRoutes,
      updatedAt: serverTimestamp(),
    };
    await Promise.all([
      updateDoc(globalActivityRef, updateData),
      updateDoc(userActivityRef, updateData),
    ]);
  } else {
    // Handle non-route-based activities
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
