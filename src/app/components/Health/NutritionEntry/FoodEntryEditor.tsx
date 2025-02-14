import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Ingredient, MealEntry } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';
import BaseNutritionInputs, {
  BaseNutritionStringed,
} from './BaseNutritionInputs';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Food, Portion } from '@/types/Food';
import { FoodSearch } from './FoodSearch';

interface FoodEntryEditorProps {
  mealEntry: MealEntry;
  onUpdateMealEntry: (mealEntry: MealEntry) => void;
  onRemoveMealEntry: () => void;
}

const Tab = {
  manual: 'Manual',
  storeBought: 'Store Bought',
  homemade: 'Homemade',
};

const FoodEntryEditor = ({
  mealEntry,
  onUpdateMealEntry,
  onRemoveMealEntry,
}: FoodEntryEditorProps) => {
  const [foodName, setFoodName] = useState(mealEntry.name);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutritionStringed>({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    mealEntry.ingredients || []
  );

  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [portions, setPortions] = useState<Portion[]>([]);
  const [portionAmount, setPortionAmount] = useState('');

  const handleAddIngredient = (ingredients: Ingredient[]) => {
    setIngredients(ingredients);
    onUpdateMealEntry({ ...mealEntry, ingredients });
  };

  const handleSearchSelect = (food: Food) => {
    console.log(food);
    setFoodName(food.foodName);
    if (food.portions.length > 0) {
      setSelectedPortion(food.portions[0]);
      setPortions(food.portions);
    }
  };

  return (
    <div className="border bg-stone-50 p-4 pt-2 rounded-md relative space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-lg">Food</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemoveMealEntry}
          className="translate-x-2"
        >
          <X />
        </Button>
      </div>

      <div className="space-y-1">
        <Label htmlFor="foodName" className="text-sm">
          Name
        </Label>
        <FoodSearch
          placeholder="Spaghetti"
          value={foodName}
          onChange={(text) => {
            setFoodName(text);
            onUpdateMealEntry({ ...mealEntry, name: text });
          }}
          onSelect={handleSearchSelect}
        />
      </div>

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
                value={portionAmount}
                onChange={(e) => {
                  setPortionAmount(e.target.value);
                  onUpdateMealEntry({ ...mealEntry, name: e.target.value });
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

      <Accordion
        type="single"
        defaultValue="nutrition"
        collapsible
        className="space-y-2"
      >
        <AccordionItem value="nutrition" className="border-none">
          <AccordionTrigger
            className={cn(
              '[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 ',
              'text-start hover:no-underline border rounded-md p-3 bg-white text-sm',
              'data-[state=open]:rounded-b-none data-[state=open]:bg-stone-100',
              'transition-all duration-200 ease-in-out'
            )}
          >
            Nutrition
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <BaseNutritionInputs
              value={baseNutrition}
              setValue={setBaseNutrition}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        defaultValue="ingredients"
        collapsible
        className="space-y-2"
      >
        <AccordionItem value="ingredients" className="border-none">
          <AccordionTrigger
            className={cn(
              '[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 ',
              'text-start hover:no-underline border rounded-md p-3 bg-white text-sm',
              'data-[state=open]:rounded-b-none data-[state=open]:bg-stone-100',
              'transition-all duration-200 ease-in-out'
            )}
          >
            Ingredients
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            hey
            {/* <AddIngredients
              onAddIngredient={handleAddIngredient}
              entryType={mealEntry.entryType}
            /> */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FoodEntryEditor;
