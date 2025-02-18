import { Meal } from '@/types/Nutrition';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export async function createNutrition(
  userId: string,
  nutritionData: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const nutritionId = doc(collection(db, 'nutrients')).id;

  const nutritionWithUserAndId = {
    ...(nutritionData as object),
    id: nutritionId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userNutritionRef = doc(db, `users/${userId}/nutrients`, nutritionId);

  await setDoc(userNutritionRef, nutritionWithUserAndId);

  return nutritionId;
}
