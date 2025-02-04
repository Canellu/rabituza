import { ActivityData } from '@/types/Activity';
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createActivity<T extends ActivityData>(
  userId: string,
  activityData: T
) {
  const batch = writeBatch(db);

  const activityId = doc(collection(db, 'activities')).id;

  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  const activityWithUser = {
    ...activityData,
    userId,
    createdAt: serverTimestamp(),
  };

  batch.set(globalActivityRef, activityWithUser);
  batch.set(userActivityRef, activityWithUser);

  await batch.commit();

  return activityId;
}
