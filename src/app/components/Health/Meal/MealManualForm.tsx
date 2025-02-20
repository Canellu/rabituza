import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import BaseNutritionInputs, {
  BaseNutritionStringed,
} from './BaseNutritionInputs';

interface MealManualFormProps {
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
  calories: string;
  setCalories: Dispatch<SetStateAction<string>>;
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  baseNutrition: BaseNutritionStringed;
  setBaseNutrition: Dispatch<SetStateAction<BaseNutritionStringed>>;
}

const MealManualForm = ({
  itemName,
  setItemName,
  calories,
  setCalories,
  quantity,
  setQuantity,
  baseNutrition,
  setBaseNutrition,
}: MealManualFormProps) => {
  const handleChangeCalories = (e: ChangeEvent<HTMLInputElement>) => {
    setCalories(e.target.value);
    const calculatedCalories = Number(e.target.value) * Number(quantity);
    if (calculatedCalories > 0) {
      setBaseNutrition((prev) => ({
        ...prev,
        calories: calculatedCalories.toString(),
      }));
    }
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    const calculatedCalories = Number(calories) * Number(e.target.value);
    setBaseNutrition((prev) => ({
      ...prev,
      calories: calculatedCalories.toString(),
    }));
  };

  return (
    <div className="flex flex-col gap-2">
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-sm">Calories</Label>
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
                'border bg-stone-50 rounded-r-md',
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
        <div className="flex-1 space-y-1">
          <Label htmlFor="quantity" className="text-sm">
            Quantity
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
      </div>
      <Accordion type="single" defaultValue="" collapsible>
        <AccordionItem value="nutrition" className="border-none">
          <AccordionTrigger
            className={cn(
              '[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 ',
              'text-start hover:no-underline border rounded-md p-3 bg-white text-sm',
              'data-[state=open]:rounded-b-none bg-stone-100',
              'transition-all duration-200 ease-in-out '
            )}
          >
            Total nutrition
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <BaseNutritionInputs
              value={baseNutrition}
              setValue={setBaseNutrition}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MealManualForm;
