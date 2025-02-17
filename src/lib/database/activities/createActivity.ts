import { ActivityDataType, BaseActivityType } from '@/types/Activity';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createActivity<
  T extends ActivityDataType &
    Pick<BaseActivityType, 'ratings' | 'activityDate'>
>(userId: string, activityData: T) {
  const activityId = doc(collection(db, 'activities')).id;

  const activityWithUserAndId = {
    ...activityData,
    id: activityId,
    userId,
    createdAt: serverTimestamp(),
  };

  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  const batch = writeBatch(db);
  batch.set(globalActivityRef, activityWithUserAndId);
  batch.set(userActivityRef, activityWithUserAndId);

  // Commit the batch for the main activity data
  await batch.commit();

  // Handle routes as a subcollection for both locations
  if (activityData.type === 'driving' && activityData.routes) {
    const globalRoutesRef = collection(globalActivityRef, 'routes');
    const userRoutesRef = collection(userActivityRef, 'routes');

    for (const route of activityData.routes) {
      const routeId = doc(collection(db, 'temp')).id;
      const geolocations = route.geolocations.map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
        accuracy: location.accuracy,
        speed: location.speed,
      }));

      // Save route to both locations with the same ID
      await Promise.all([
        setDoc(doc(globalRoutesRef, routeId), {
          id: routeId,
          geolocations,
        }),
        setDoc(doc(userRoutesRef, routeId), {
          id: routeId,
          geolocations,
        }),
      ]);
    }
  }

  return activityId;
}
