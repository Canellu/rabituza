import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Food, Portion } from '@/types/Food';
import { Dispatch, SetStateAction, useState } from 'react';
import { BaseNutritionStringed } from './BaseNutritionInputs';
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
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [portions, setPortions] = useState<Portion[]>([]);

  const handleSearchSelect = (food: Food) => {
    console.log(food);
    setItemName(food.foodName);
    if (food.portions.length > 0) {
      setSelectedPortion(food.portions[0]);
      setPortions(food.portions);
    }
  };

  const handleSearchClear = () => {
    setPortions([]);
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
      <div className="space-y-2">
        {portions.length > 0 && (
          <div className="flex gap-2 items-end">
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
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                className="text-ellipsis"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-sm">Portion size</Label>
              <Select
                value={selectedPortion?.portionName}
                onValueChange={(value) => {
                  const portion = portions.find((p) => p.portionName === value);
                  setSelectedPortion(portion || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portion" />
                </SelectTrigger>
                <SelectContent>
                  {portions.map((portion) => (
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
        )}
      </div>
    </>
  );
};

export default MealSearchForm;
