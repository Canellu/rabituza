import { ActivityDataType, BaseActivityType } from '@/types/Activity';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function updateActivity<
  T extends ActivityDataType &
    Pick<BaseActivityType, 'ratings' | 'activityDate'>
>(userId: string, activityId: string, activityData: T) {
  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  const updatedActivityData = {
    ...activityData,
    updatedAt: serverTimestamp(), // Optionally track when the activity was updated
  };

  await updateDoc(globalActivityRef, updatedActivityData);
  await updateDoc(userActivityRef, updatedActivityData);
}
