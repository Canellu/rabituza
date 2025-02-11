import { NutritionTarget } from '@/types/Nutrition';
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createNutritionTarget(
  userId: string,
  targetData: Omit<NutritionTarget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const targetId = doc(collection(db, `users/${userId}/nutritionTargets`)).id;

  const targetWithUserAndId = {
    ...targetData,
    id: targetId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userTargetRef = doc(db, `users/${userId}/nutritionTargets`, targetId);

  const batch = writeBatch(db);
  batch.set(userTargetRef, targetWithUserAndId);
  await batch.commit();

  return targetId;
}