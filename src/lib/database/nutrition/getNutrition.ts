import { Meal } from '@/types/Nutrition';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getNutrition = async (userId: string): Promise<Meal[]> => {
  try {
    const nutritionRef = collection(db, `users/${userId}/nutrition`);
    const querySnapshot = await getDocs(nutritionRef);

    const nutritionEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId,
        mealType: data.mealType,
        mealDate: data.mealDate.toDate(),
        mealEntries: data.mealEntries,
        notes: data.notes || '',
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Meal;
    });

    return nutritionEntries.sort(
      (a, b) => b.mealDate.getTime() - a.mealDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching nutrition entries:', error);
    return [];
  }
};
