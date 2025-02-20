import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Food, Portion } from '@/types/Food';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import BaseNutritionInputs, {
  BaseNutritionStringed,
} from './BaseNutritionInputs';
import { FoodSearch } from './FoodSearch';

interface MealSearchFormProps {
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
  calories: string;
  setCalories: Dispatch<SetStateAction<string>>;
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  baseNutrition: BaseNutritionStringed;
  setBaseNutrition: Dispatch<SetStateAction<BaseNutritionStringed>>;
}

const MealSearchForm = ({
  itemName,
  setItemName,
  calories,
  setCalories,
  quantity,
  setQuantity,
  baseNutrition,
  setBaseNutrition,
}: MealSearchFormProps) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);

  const handleSearchSelect = (food: Food) => {
    console.log(food);
    setSelectedFood(food);
    if (food.portions.length > 0) {
      setSelectedPortion(food.portions[0]);
    }
  };

  const handleSearchClear = () => {
    setItemName('');
  };

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
    <>
      <FoodSearch
        placeholder="Spaghetti"
        value={itemName}
        onChange={(text) => {
          setItemName(text);
        }}
        onSelect={handleSearchSelect}
        onClear={handleSearchClear}
        className="flex-shrink"
      />
      {selectedFood && selectedFood?.portions.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="portionAmount" className="text-sm">
                Amount
              </Label>
              <Input
                id="portionAmount"
                name="portionAmount"
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={handleChangeQuantity}
                autoComplete="off"
                placeholder="0"
                className="text-ellipsis"
              />
            </div>
            <div className="flex-1 space-y-1 col-span-3">
              <Label className="text-sm">Portion size</Label>
              <Select
                value={selectedPortion?.portionName}
                onValueChange={(value) => {
                  if (selectedFood) {
                    const portion = selectedFood.portions.find(
                      (p) => p.portionName === value
                    );
                    setSelectedPortion(portion || null);
                  }
                }}
              >
                <SelectTrigger className="text-start">
                  <SelectValue placeholder="Select portion" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFood &&
                    selectedFood.portions.map((portion) => (
                      <SelectItem
                        key={portion.portionName}
                        value={portion.portionName}
                      >
                        {portion.portionName} ({portion.quantity}
                        {portion.unit})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

export default MealSearchForm;
