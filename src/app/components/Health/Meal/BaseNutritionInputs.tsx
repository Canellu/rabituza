'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BaseNutrition } from '@/types/Nutrition';
import { ChangeEvent, Fragment } from 'react';

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
  setValue: (value: BaseNutritionStringed) => void;
  className?: string;
}

const BaseNutritionInputs = ({
  value,
  setValue,
  className = '',
}: BaseNutritionInputsProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const nutritionFields = [
    {
      id: 'calories',
      label: 'Calories',
      unit: 'kcal',
      labelClass: 'col-span-3',
      inputClass: 'col-span-4',
    },
    {
      id: 'protein',
      label: 'Protein',
      unit: 'g',
      labelClass: 'col-span-4',
      inputClass: 'col-span-3',
    },
    {
      id: 'carbs',
      label: 'Carbs',
      unit: 'g',
      labelClass: 'col-span-4',
      inputClass: 'col-span-3',
    },
    {
      id: 'fat',
      label: 'Fat',
      unit: 'g',
      labelClass: 'col-span-4',
      inputClass: 'col-span-3',
    },
    {
      id: 'fiber',
      label: 'Fiber',
      unit: 'g',
      labelClass: 'col-span-4',
      inputClass: 'col-span-3',
    },
  ] as const;

  return (
    <div
      className={cn(
        'grid grid-cols-7 gap-2 border rounded-md p-4 bg-white dark:bg-stone-800 dark:border-transparent',
        className
      )}
    >
      {nutritionFields.map(({ id, label, unit, labelClass, inputClass }) => (
        <Fragment key={id}>
          <Label
            htmlFor={id}
            className={cn(labelClass, 'self-center text-sm font-normal')}
          >
            {label}
          </Label>
          <div className={cn('relative', inputClass)}>
            <Input
              id={id}
              name={id}
              type="text"
              inputMode="numeric"
              value={value[id as keyof BaseNutritionStringed]}
              onChange={handleChange}
              autoComplete="off"
              placeholder={label}
              className={unit === 'kcal' ? 'pr-12' : 'pr-8'}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
              {unit}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default BaseNutritionInputs;
