import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { BaseNutritionStringed } from './BaseNutritionInputs';

interface MealManualFormProps {
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
  calories: string;
  setCalories: Dispatch<SetStateAction<string>>;
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  setBaseNutrition: Dispatch<SetStateAction<BaseNutritionStringed>>;
}

const MealManualForm = ({
  itemName,
  setItemName,
  calories,
  setCalories,
  quantity,
  setQuantity,
  setBaseNutrition,
}: MealManualFormProps) => {
  const handleChangeCalories = (e: ChangeEvent<HTMLInputElement>) => {
    const newCaloriesPerUnit = e.target.value;
    setCalories(newCaloriesPerUnit);

    if (Number(newCaloriesPerUnit) > 0 && Number(quantity) > 0) {
      const calculatedCalories = Number(newCaloriesPerUnit) * Number(quantity);
      setBaseNutrition((prev) => ({
        ...prev,
        calories: Math.round(calculatedCalories).toString(),
      }));
    }
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuantity(inputValue);

    if (inputValue && Number(inputValue) > 0) {
      const newQuantity = Number(inputValue).toFixed(2);
      if (Number(calories) > 0) {
        const calculatedCalories = Number(calories) * Number(newQuantity);
        setBaseNutrition((prev) => ({
          ...prev,
          calories: Math.round(calculatedCalories).toString(),
        }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label className="text-sm">Name</Label>
        <Input
          type="text"
          id="itemName"
          placeholder=""
          value={itemName}
          autoComplete="off"
          onChange={(e) => setItemName(e.currentTarget.value)}
          className="flex-grow"
        />
      </div>
      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="flex-1 space-y-1 col-span-2">
          <Label htmlFor="quantity" className="text-sm">
            Amount
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            placeholder="0"
            min={0}
            value={quantity}
            onChange={handleChangeQuantity}
          />
        </div>
        <div className="flex-1 space-y-1 col-span-5">
          <Label className="text-sm">Calories per unit</Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="kcal"
              value={calories}
              onChange={handleChangeCalories}
            />
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 right-0',
                'border bg-stone-50 dark:bg-stone-800 dark:border-transparent rounded-r-md',
                'text-xs text-muted-foreground',
                'flex items-center justify-center h-full',
                'px-2',
                'text-nowrap'
              )}
            >
              Unit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealManualForm;
