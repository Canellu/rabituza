export const NutrientIds = {
  PROTEIN: 'Protein',
  CARBS: 'Karbo',
  FAT: 'Fett',
  FIBER: 'Fiber',
} as const;

export type Nutrient = {
  sourceId: string;
  nutrientId: string;
  quantity?: number;
  unit?: string;
};

export type Portion = {
  portionName: string;
  portionUnit: string;
  quantity: number;
  unit: string;
};

export type EdiblePart = {
  percent: number;
  sourceId: string;
};

export type CalorieInfo = {
  sourceId: string;
  quantity: number;
  unit: string;
};

export type EnergyInfo = {
  sourceId: string;
  quantity: number;
  unit: string;
};

export type Food = {
  foodId: string;
  uri: string;
  foodGroupId: string;
  searchKeywords: string[];
  calories: CalorieInfo;
  portions: Portion[];
  ediblePart: EdiblePart;
  langualCodes: string[];
  energy: EnergyInfo;
  foodName: string;
  latinName: string;
  constituents: Nutrient[];
};
