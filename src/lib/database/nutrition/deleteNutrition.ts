import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function deleteNutrition(userId: string, nutritionId: string) {
  const batch = writeBatch(db);

  const globalNutritionRef = doc(db, 'nutrition', nutritionId);
  const userNutritionRef = doc(db, `users/${userId}/nutrition`, nutritionId);

  batch.delete(globalNutritionRef);
  batch.delete(userNutritionRef);

  await batch.commit();
}