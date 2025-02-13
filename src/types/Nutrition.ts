export const MealTypes = {
  Breakfast: 'breakfast',
  Lunch: 'lunch',
  Dinner: 'dinner',
  Snack: 'snack',
} as const;

// Define separate units for food and drinks
export const FoodUnits = {
  Gram: 'g',
  Kilogram: 'kg',
  Piece: 'pc',
  Serving: 'serving',
} as const;

export const DrinkUnits = {
  Milliliter: 'ml',
  Liter: 'l',
  Serving: 'serving',
} as const;

export const MealEntryTypes = {
  Food: 'food',
  Drink: 'drink',
} as const;

export type MealEntryType =
  (typeof MealEntryTypes)[keyof typeof MealEntryTypes];
export type MealType = (typeof MealTypes)[keyof typeof MealTypes];
export type FoodUnit = (typeof FoodUnits)[keyof typeof FoodUnits];
export type DrinkUnit = (typeof DrinkUnits)[keyof typeof DrinkUnits];

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

export type MealEntry = BaseNutrition & {
  name: string;
  entryType: MealEntryType;
  ingredients: Ingredient[];
};

export type Ingredient = BaseNutrition & {
  name: string;
  amount: number;
  unit: FoodUnit | DrinkUnit; // Use the new unit types
};

export type NutritionEntry = {
  id: string;
  userId: string;
  mealDate: Date;
  mealType: MealType;
  mealEntries: MealEntry[];
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
