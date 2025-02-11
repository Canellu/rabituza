import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function deleteNutritionTarget(userId: string, targetId: string) {
  const batch = writeBatch(db);

  const userTargetRef = doc(db, `users/${userId}/nutritionTargets`, targetId);

  batch.delete(userTargetRef);

  await batch.commit();
}