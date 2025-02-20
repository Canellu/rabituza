import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Food, NutrientIds, Portion } from '@/types/Food';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { BaseNutritionStringed } from './BaseNutritionInputs';
import { FoodSearch } from './FoodSearch';

interface MealSearchFormProps {
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
  calories: string;
  setCalories: Dispatch<SetStateAction<string>>;
  quantity: string;
  setQuantity: Dispatch<SetStateAction<string>>;
  selectedFood: Food | null;
  setSelectedFood: Dispatch<SetStateAction<Food | null>>;
  selectedPortion: Portion | null;
  setSelectedPortion: Dispatch<SetStateAction<Portion | null>>;
  baseNutrition: BaseNutritionStringed;
  setBaseNutrition: Dispatch<SetStateAction<BaseNutritionStringed>>;
}

const MealSearchForm = ({
  itemName,
  setItemName,
  setCalories,
  quantity,
  setQuantity,
  selectedFood,
  setSelectedFood,
  selectedPortion,
  setSelectedPortion,
  setBaseNutrition,
}: MealSearchFormProps) => {
  const calculateNutrition = (amount: number, portion: Portion, food: Food) => {
    const portionRatio = portion.quantity / 100;
    const calories = amount * portionRatio * food.calories.quantity;
    const protein = food.constituents.find(
      (n) => n.nutrientId === NutrientIds.PROTEIN
    );
    const carbs = food.constituents.find(
      (n) => n.nutrientId === NutrientIds.CARBS
    );
    const fat = food.constituents.find((n) => n.nutrientId === NutrientIds.FAT);
    const fiber = food.constituents.find(
      (n) => n.nutrientId === NutrientIds.FIBER
    );

    setBaseNutrition((prev) => ({
      ...prev,
      calories: Math.round(calories).toString(),
      protein: ((protein?.quantity || 0) * amount * portionRatio).toFixed(1),
      carbs: ((carbs?.quantity || 0) * amount * portionRatio).toFixed(1),
      fat: ((fat?.quantity || 0) * amount * portionRatio).toFixed(1),
      fiber: ((fiber?.quantity || 0) * amount * portionRatio).toFixed(1),
    }));
  };

  const handleSearchSelect = (food: Food) => {
    setSelectedFood(food);
    setItemName(food.foodName);
    setCalories(food.calories.quantity.toString());

    if (food.portions.length > 0) {
      const initialPortion = food.portions[0];
      setSelectedPortion(initialPortion);
      setQuantity('1');
      calculateNutrition(1, initialPortion, food);
    }
  };

  const handleSearchClear = () => {
    setItemName('');
    setSelectedFood(null);
    setBaseNutrition({
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
    });
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    if (selectedFood && selectedPortion) {
      calculateNutrition(Number(e.target.value), selectedPortion, selectedFood);
    }
  };

  const handleSelectPortion = (portionName: string) => {
    const portion = selectedFood?.portions.find(
      (p) => p.portionName === portionName
    );
    setSelectedPortion(portion || null);

    if (selectedFood && portion && quantity) {
      calculateNutrition(Number(quantity), portion, selectedFood);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label className="text-sm">Search</Label>
        <FoodSearch
          placeholder=""
          value={itemName}
          onChange={(text) => {
            setItemName(text);
          }}
          onSelect={handleSearchSelect}
          onClear={handleSearchClear}
        />
      </div>
      {selectedFood && selectedFood?.portions.length > 0 && (
        <div className="grid grid-cols-7 gap-2 items-end">
          <div className="flex-1 space-y-1 col-span-2">
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
          <div className="flex-1 space-y-1 col-span-5">
            <Label className="text-sm">Portion size</Label>
            <Select
              value={selectedPortion?.portionName}
              onValueChange={handleSelectPortion}
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
      )}
    </div>
  );
};

export default MealSearchForm;
