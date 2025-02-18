import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export async function deleteNutrition(userId: string, nutritionId: string) {
  const userNutritionRef = doc(db, `users/${userId}/nutrients`, nutritionId);

  await deleteDoc(userNutritionRef);
}
