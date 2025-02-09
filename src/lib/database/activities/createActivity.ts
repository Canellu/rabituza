import { ActivityDataType, BaseActivityType } from '@/types/Activity';
import {
  collection,
  doc,
  serverTimestamp,
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
  await batch.commit();

  return activityId;
}

