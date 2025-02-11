export const MealTypes = {
  Breakfast: 'breakfast',
  Lunch: 'lunch',
  Dinner: 'dinner',
  Snack: 'snack',
} as const;

export const Units = {
  Gram: 'g',
  Kilogram: 'kg',
  Milliliter: 'ml',
  Liter: 'l',
  Piece: 'pc',
  Serving: 'serving',
} as const;

export type MealType = (typeof MealTypes)[keyof typeof MealTypes];
export type Unit = (typeof Units)[keyof typeof Units];

export type BaseNutrition = {
  /** Kilocalories (kcal) */
  calories: number;
  /** Grams (g) */
  protein: number;
  /** Grams (g) */
  carbs: number;
  /** Grams (g) */
  fat: number;
  /** Grams (g) */
  fiber: number;
};

export type Ingredient = BaseNutrition & {
  name: string;
  amount: number;
  unit: Unit;
};

export type PreparedMeal = BaseNutrition & {
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: Unit;
};

export type Drink = {
  name: string;
  calories: number;
  amount: number;
  unit: Unit;
};

export type MealContent =
  | { foods: Ingredient[]; preparedMeals: never }
  | { foods: never; preparedMeals: PreparedMeal[] };

export type NutritionEntry = {
  id: string;
  userId: string;
  mealType: MealType;
  mealDate: Date;
  drinks: Drink[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} & MealContent;

export type NutritionTarget = {
  id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  startDate: Date;
  endDate: Date;
  daysOfWeek: number[]; // 0-6 for Monday-Sunday
};
