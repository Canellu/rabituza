'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BaseNutrition } from '@/types/Nutrition';
import { useEffect, useState } from 'react';

// Create a new type that allows string values for nutrition fields
export type BaseNutritionInputsState = Omit<
  BaseNutrition,
  'calories' | 'protein' | 'carbs' | 'fat' | 'fiber'
> & {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

interface BaseNutritionInputsProps {
  onChange: (nutrition: BaseNutrition) => void;
  className?: string;
  value?: BaseNutrition; // Add this
}

const BaseNutritionInputs = ({
  onChange,
  className = '',
  value,
}: BaseNutritionInputsProps) => {
  const [nutrition, setNutrition] = useState<BaseNutritionInputsState>({
    calories: value?.calories?.toString() || '',
    protein: value?.protein?.toString() || '',
    carbs: value?.carbs?.toString() || '',
    fat: value?.fat?.toString() || '',
    fiber: value?.fiber?.toString() || '',
  });

  useEffect(() => {
    setNutrition({
      calories: value?.calories?.toString() || '',
      protein: value?.protein?.toString() || '',
      carbs: value?.carbs?.toString() || '',
      fat: value?.fat?.toString() || '',
      fiber: value?.fiber?.toString() || '',
    });
  }, [value]);

  const handleChange = (
    field: keyof BaseNutritionInputsState,
    value: string
  ) => {
    const updatedNutrition = {
      ...nutrition,
      [field]: value,
    };
    setNutrition(updatedNutrition);
    onChange({
      calories:
        updatedNutrition.calories === ''
          ? 0
          : Number(updatedNutrition.calories),
      protein:
        updatedNutrition.protein === '' ? 0 : Number(updatedNutrition.protein),
      carbs: updatedNutrition.carbs === '' ? 0 : Number(updatedNutrition.carbs),
      fat: updatedNutrition.fat === '' ? 0 : Number(updatedNutrition.fat),
      fiber: updatedNutrition.fiber === '' ? 0 : Number(updatedNutrition.fiber),
    });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 border rounded-b-md p-4 bg-white border-t-0',
        className
      )}
    >
      <Label htmlFor="calories" className="self-center text-sm font-normal">
        Calories
      </Label>
      <div className="relative">
        <Input
          id="calories"
          name="calories"
          type="text"
          inputMode="numeric"
          value={nutrition.calories}
          onChange={(e) => handleChange('calories', e.target.value)}
          placeholder="Calories"
          className="pr-12"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
          kcal
        </div>
      </div>
      <Label htmlFor="protein" className="self-center text-sm font-normal">
        Protein
      </Label>
      <div className="relative">
        <Input
          id="protein"
          name="protein"
          type="text"
          inputMode="numeric"
          value={nutrition.protein}
          onChange={(e) => handleChange('protein', e.target.value)}
          placeholder="Protein"
          className="pr-8"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
          g
        </div>
      </div>
      <Label htmlFor="carbs" className="self-center text-sm font-normal">
        Carbs
      </Label>
      <div className="relative">
        <Input
          id="carbs"
          name="carbs"
          type="text"
          inputMode="numeric"
          value={nutrition.carbs}
          onChange={(e) => handleChange('carbs', e.target.value)}
          placeholder="Carbs"
          className="pr-8"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
          g
        </div>
      </div>
      <Label htmlFor="fat" className="self-center text-sm font-normal">
        Fat
      </Label>
      <div className="relative">
        <Input
          id="fat"
          name="fat"
          type="text"
          inputMode="numeric"
          value={nutrition.fat}
          onChange={(e) => handleChange('fat', e.target.value)}
          placeholder="Fat"
          className="pr-8"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
          g
        </div>
      </div>
      <Label htmlFor="fiber" className="self-center text-sm font-normal">
        Fiber
      </Label>
      <div className="relative">
        <Input
          id="fiber"
          name="fiber"
          type="text"
          inputMode="numeric"
          value={nutrition.fiber}
          onChange={(e) => handleChange('fiber', e.target.value)}
          placeholder="Fiber"
          className="pr-8"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
          g
        </div>
      </div>
    </div>
  );
};

export default BaseNutritionInputs;
