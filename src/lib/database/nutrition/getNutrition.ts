import { NutritionEntry } from '@/types/Nutrition';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getNutrition = async (
  userId: string
): Promise<NutritionEntry[]> => {
  try {
    const nutritionRef = collection(db, `users/${userId}/nutrition`);
    const querySnapshot = await getDocs(nutritionRef);

    const nutritionEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const baseEntry = {
        id: doc.id,
        userId,
        mealType: data.mealType,
        mealDate: data.mealDate.toDate(),
        drinks: data.drinks || [],
        notes: data.notes || '',
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      // Handle MealContent union type
      if (data.foods) {
        return {
          ...baseEntry,
          foods: data.foods,
          preparedMeals: undefined,
        } as NutritionEntry;
      } else {
        return {
          ...baseEntry,
          preparedMeals: data.preparedMeals,
          foods: undefined,
        } as NutritionEntry;
      }
    });

    return nutritionEntries.sort(
      (a, b) => b.mealDate.getTime() - a.mealDate.getTime()
    );
  } catch (error) {
    console.error('Error fetching nutrition entries:', error);
    return [];
  }
};