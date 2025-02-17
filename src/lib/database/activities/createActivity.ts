import { ActivityDataType, BaseActivityType } from '@/types/Activity';
import {
  collection,
  doc,
  GeoPoint,
  serverTimestamp,
  setDoc,
  Timestamp,
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
      const geolocations = route.map((location) => ({
        location: new GeoPoint(location.latitude, location.longitude),
        timestamp: Timestamp.fromMillis(location.timestamp),
        sessionId: location.sessionId,
      }));

      // Save route to both locations
      await Promise.all([
        setDoc(doc(globalRoutesRef), { geolocations }),
        setDoc(doc(userRoutesRef), { geolocations }),
      ]);
    }
  }

  return activityId;
}
