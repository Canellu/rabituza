'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BaseNutrition } from '@/types/Nutrition';
import { Dispatch, SetStateAction } from 'react';

// Create a new type that allows string values for nutrition fields
export type BaseNutritionStringed = Omit<
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
  value: BaseNutritionStringed;
  setValue: Dispatch<SetStateAction<BaseNutritionStringed>>;
  className?: string;
}

const BaseNutritionInputs = ({
  value,
  setValue,
  className = '',
}: BaseNutritionInputsProps) => {
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
          value={value.calories}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              calories: e.target.value,
            }))
          }
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
          value={value.protein}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              protein: e.target.value,
            }))
          }
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
          value={value.carbs}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              carbs: e.target.value,
            }))
          }
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
          value={value.fat}
          onChange={(e) => {
            setValue((prev) => ({
              ...prev,
              fat: e.target.value,
            }));
          }}
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
          value={value.fiber}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              fiber: e.target.value,
            }))
          }
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
