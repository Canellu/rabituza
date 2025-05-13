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

  // Check if the activity type is driving or running
  if (activityData.type === 'driving' || activityData.type === 'running') {
    const activityWithRoutes = activityData as (
      | DrivingDataType
      | RunningDataType
    ) &
      BaseActivityType;
    const { routes, ...activityDataWithoutRoutes } = activityWithRoutes;

    const globalRoutesRef = collection(globalActivityRef, 'routes');
    const userRoutesRef = collection(userActivityRef, 'routes');

    // Get all existing routes from both collections
    const [globalRoutesSnap, userRoutesSnap] = await Promise.all([
      getDocs(globalRoutesRef),
      getDocs(userRoutesRef),
    ]);

    // Create a set of existing route IDs
    const existingRouteIds = new Set([
      ...globalRoutesSnap.docs.map(doc => doc.id),
      ...userRoutesSnap.docs.map(doc => doc.id),
    ]);

    // Handle routes as a subcollection if they exist
    if (routes && routes.length > 0) {
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
    }

    // Delete routes that are no longer in the routes array
    const currentRouteIds = new Set(routes?.map(r => r.id) || []);
    const deletePromises = [];

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
