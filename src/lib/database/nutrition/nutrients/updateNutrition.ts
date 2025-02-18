import { Meal } from '@/types/Nutrition';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export async function updateNutrition(
  userId: string,
  nutritionId: string,
  nutritionData: Partial<
    Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  >
) {
  const userNutritionRef = doc(db, `users/${userId}/nutrients`, nutritionId);

  const updatedNutritionData = {
    ...nutritionData,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(userNutritionRef, updatedNutritionData);
}
