import { Meal } from '@/types/Nutrition';
import { User } from '@/types/User';
import { differenceInYears } from 'date-fns';

// Activity Level Multipliers and corresponding nutritional recommendations
export const activityLevels = {
  sedentary: {
    displayName: 'Sedentary (little/no exercise)',
    shortName: 'Potato',
    calorieMultiplier: 1.2,
    proteinPerKg: 0.8,
    carbsPercent: 0.45,
    fatPercent: 0.35,
    fiberPerThousandCal: 14,
  },
  light: {
    displayName: 'Light (1-3 days/week)',
    shortName: 'Noob',
    calorieMultiplier: 1.375,
    proteinPerKg: 1.2,
    carbsPercent: 0.5,
    fatPercent: 0.3,
    fiberPerThousandCal: 14,
  },
  moderate: {
    displayName: 'Moderate (3-5 days/week)',
    shortName: 'Gains',
    calorieMultiplier: 1.55,
    proteinPerKg: 1.4,
    carbsPercent: 0.55,
    fatPercent: 0.25,
    fiberPerThousandCal: 14,
  },
  veryActive: {
    displayName: 'Very Active (6-7 days/week)',
    shortName: 'Beast',
    calorieMultiplier: 1.725,
    proteinPerKg: 1.6,
    carbsPercent: 0.6,
    fatPercent: 0.25,
    fiberPerThousandCal: 15,
  },
  extraActive: {
    displayName: 'Extra Active (2× daily training)',
    shortName: 'Gigachad',
    calorieMultiplier: 1.9,
    proteinPerKg: 2.0,
    carbsPercent: 0.65,
    fatPercent: 0.2,
    fiberPerThousandCal: 15,
  },
};

export const calculateBMR = (user: User) => {
  if (!user?.weight || !user?.height || !user?.gender || !user?.dob)
    return 1600;

  const age = differenceInYears(new Date(), user.dob);

  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Formula (1990):
  // Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
  // Women: (10 × weight) + (6.25 × height) - (5 × age) - 161
  const bmr =
    user.gender.toLowerCase() === 'female'
      ? 10 * user.weight + 6.25 * user.height - 5 * age - 161
      : 10 * user.weight + 6.25 * user.height - 5 * age + 5;

  return bmr;
};

export const calculateRecommendedNutritionalValues = (
  user?: User,
  activityLevel: keyof typeof activityLevels = 'light',
  nutritionalGoal: keyof typeof nutritionalGoals = 'maintenance'
) => {
  if (!user?.weight || !user?.height || !user?.gender || !user?.dob) {
    return {
      calories: '2000',
      protein: '65',
      carbs: '250',
      fat: '70',
      fiber: '30',
      bmr: '0',
    };
  }

  const bmr = calculateBMR(user);
  const activity = activityLevels[activityLevel] || activityLevels.light;
  const goal =
    nutritionalGoals[nutritionalGoal] || nutritionalGoals.maintenance;

  const baseCalories = Math.round(bmr * activity.calorieMultiplier);
  const calories = Math.round(baseCalories * goal.calorieAdjustment);

  const protein = Math.round(
    user.weight * activity.proteinPerKg * goal.proteinAdjustment
  );
  const carbs = Math.round(
    (calories * activity.carbsPercent * goal.carbsAdjustment) / 4
  );
  const fat = Math.round(
    (calories * activity.fatPercent * goal.fatAdjustment) / 9
  );
  const fiber = Math.round(
    (calories / 1000) * activity.fiberPerThousandCal * goal.fiberAdjustment
  );

  return {
    calories: calories.toString(),
    protein: protein.toString(),
    carbs: carbs.toString(),
    fat: fat.toString(),
    fiber: fiber.toString(),
  };
};

export const nutritionalGoals = {
  weightLoss: {
    id: 'weightLoss',
    displayName: 'Lose Weight',
    shortName: '↓ Cut',
    calorieAdjustment: 0.8, // 20% deficit
    proteinAdjustment: 1.2, // Increase protein to preserve muscle
    carbsAdjustment: 0.7, // Reduce carbs significantly
    fatAdjustment: 0.9, // Moderate fat reduction
    fiberAdjustment: 1.2, // Increase fiber for satiety
  },
  maintenance: {
    id: 'maintenance',
    displayName: 'Maintain Weight',
    shortName: '→ Maintain',
    calorieAdjustment: 1.0,
    proteinAdjustment: 1.0,
    carbsAdjustment: 1.0,
    fatAdjustment: 1.0,
    fiberAdjustment: 1.0,
  },
  leanBulk: {
    id: 'leanBulk',
    displayName: 'Lean Muscle Gain',
    shortName: '↗ Lean Bulk',
    calorieAdjustment: 1.1, // 10% surplus
    proteinAdjustment: 1.1, // Slight protein increase
    carbsAdjustment: 1.2, // Moderate carb increase
    fatAdjustment: 1.0, // Maintain fat
    fiberAdjustment: 1.1, // Slight fiber increase
  },
  bulking: {
    id: 'bulking',
    displayName: 'Muscle Gain',
    shortName: '↑ Bulk',
    calorieAdjustment: 1.2, // 20% surplus
    proteinAdjustment: 1.2, // Higher protein for muscle growth
    carbsAdjustment: 1.3, // Higher carbs for energy
    fatAdjustment: 1.1, // Slight fat increase
    fiberAdjustment: 1.1, // Slight fiber increase
  },
} as const;

export const calculateMealTotals = (meal: Meal) => {
  const totals = meal.mealItems.reduce(
    (acc, item) => {
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      acc.fiber += item.fiber;
      acc.protein += item.protein;
      acc.calories += item.calories;
      return acc;
    },
    { carbs: 0, fat: 0, fiber: 0, protein: 0, calories: 0 }
  );

  return totals;
};

export const calculateMealsTotals = (meals: Meal[]) => {
  const totals = meals.reduce(
    (acc, meal) => {
      const mealTotals = calculateMealTotals(meal);
      acc.carbs += mealTotals.carbs;
      acc.fat += mealTotals.fat;
      acc.fiber += mealTotals.fiber;
      acc.protein += mealTotals.protein;
      acc.calories += mealTotals.calories;
      return acc;
    },
    { carbs: 0, fat: 0, fiber: 0, protein: 0, calories: 0 }
  );

  return totals;
};

// ... existing code ...
