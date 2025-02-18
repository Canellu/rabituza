import { NutritionTarget } from '@/types/Nutrition';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const getNutritionTargets = async (
  userId: string
): Promise<NutritionTarget[]> => {
  try {
    const targetRef = collection(db, `users/${userId}/nutritionTargets`);
    const querySnapshot = await getDocs(targetRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const nutritionTarget: NutritionTarget = {
        id: doc.id,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        fiber: data.fiber,
        daysOfWeek: data.daysOfWeek,
      };

      return nutritionTarget;
    });
  } catch (error) {
    console.error('Error fetching nutrition targets:', error);
    throw new Error('Failed to fetch nutrition targets');
  }
};
