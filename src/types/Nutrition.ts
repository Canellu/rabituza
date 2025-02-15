export const MealTypes = {
  Breakfast: 'breakfast',
  Lunch: 'lunch',
  Dinner: 'dinner',
  Snack: 'snack',
} as const;

// Define separate units for food and drinks
export const MealUnits = {
  Gram: 'g',
  Kilogram: 'kg',
  Piece: 'pc',
  Serving: 'serving',
  Milliliter: 'ml',
  Liter: 'l',
} as const;

export type MealType = (typeof MealTypes)[keyof typeof MealTypes];
export type MealUnit = (typeof MealUnits)[keyof typeof MealUnits];

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

export type MealItem = BaseNutrition & {
  name: string;
  amount?: number;
  servingSize?: number;
};

export type Meal = {
  id: string;
  userId: string;
  mealDate: Date;
  mealType: MealType;
  mealItems: MealItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

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
