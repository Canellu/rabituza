import { Meal } from '@/types/Nutrition';
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function createNutrition(
  userId: string,
  nutritionData: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const nutritionId = doc(collection(db, 'nutrition')).id;

  const nutritionWithUserAndId = {
    ...(nutritionData as object),
    id: nutritionId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const globalNutritionRef = doc(db, 'nutrition', nutritionId);
  const userNutritionRef = doc(db, `users/${userId}/nutrition`, nutritionId);

  const batch = writeBatch(db);
  batch.set(globalNutritionRef, nutritionWithUserAndId);
  batch.set(userNutritionRef, nutritionWithUserAndId);
  await batch.commit();

  return nutritionId;
}
