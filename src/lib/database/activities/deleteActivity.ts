import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function deleteActivity(userId: string, activityId: string) {
  const batch = writeBatch(db);

  // Get references to both locations where the activity is stored
  const globalActivityRef = doc(db, 'activities', activityId);
  const userActivityRef = doc(db, `users/${userId}/activities`, activityId);

  // Delete from both locations
  batch.delete(globalActivityRef);
  batch.delete(userActivityRef);

  // Commit the batch
  await batch.commit();
}
