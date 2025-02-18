import { NutritionTarget } from '@/types/Nutrition';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export async function updateNutritionTarget(
  userId: string,
  targetId: string,
  targetData: Partial<
    Omit<NutritionTarget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  >
) {
  const userTargetRef = doc(db, `users/${userId}/nutritionTargets`, targetId);

  const updatedTargetData = {
    ...targetData,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(userTargetRef, updatedTargetData);
}
