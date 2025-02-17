import {
  ActivityDataType,
  BaseActivityType,
  DrivingDataType,
} from '@/types/Activity';
import {
  addDoc,
  collection,
  doc,
  GeoPoint,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function updateActivity<
  T extends ActivityDataType &
    Pick<BaseActivityType, 'ratings' | 'activityDate'>
>(userId: string, activityId: string, activityData: T) {
  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  if (activityData.type === 'driving') {
    const drivingData = activityData as DrivingDataType & BaseActivityType;
    const { routes, ...activityDataWithoutRoutes } = drivingData;

    // Handle routes as a subcollection
    if (routes && routes.length > 0) {
      const globalRoutesRef = collection(globalActivityRef, 'routes');
      const userRoutesRef = collection(userActivityRef, 'routes');

      const newRoute = routes[0];
      const geolocations = newRoute.map((location) => ({
        location: new GeoPoint(location.latitude, location.longitude),
        timestamp: Timestamp.fromMillis(location.timestamp),
        sessionId: location.sessionId,
      }));

      // Add route to both locations
      await Promise.all([
        addDoc(globalRoutesRef, {
          geolocations,
          createdAt: serverTimestamp(),
        }),
        addDoc(userRoutesRef, {
          geolocations,
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
    // For non-driving activities, just update the activity data
    const updateData = {
      ...activityData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(globalActivityRef, updateData);
    await updateDoc(userActivityRef, updateData);
  }
}
