import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BaseNutrition, Ingredient, MealEntry } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';
import AddIngredients from './AddIngredients';
import BaseNutritionInputs, {
  BaseNutritionInputsState,
} from './BaseNutritionInputs';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Portion } from '@/types/Food';
import { FoodSearch } from './FoodSearch';

interface FoodEntryEditorProps {
  mealEntry: MealEntry;
  onUpdateMealEntry: (mealEntry: MealEntry) => void;
  onRemoveMealEntry: () => void;
}

const Tab = {
  homemade: 'Homemade',
  storeBought: 'Store Bought',
};

// FIXME: RETHINK THIS, WE SHOULD USE STRING WHEN HANDLING INPUT, THEN CONVERT TO NUMBER WHEN INSERTING TO DB!

const FoodEntryEditor = ({
  mealEntry,
  onUpdateMealEntry,
  onRemoveMealEntry,
}: FoodEntryEditorProps) => {
  const [foodName, setFoodName] = useState(mealEntry.name);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition>({
    calories: mealEntry.calories,
    protein: mealEntry.protein,
    carbs: mealEntry.carbs,
    fat: mealEntry.fat,
    fiber: mealEntry.fiber,
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    mealEntry.ingredients || []
  );

  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [portions, setPortions] = useState<Portion[]>([]);
  const [portionAmount, setPortionAmount] = useState(1);

  const handleAddIngredient = (ingredients: Ingredient[]) => {
    setIngredients(ingredients);
    onUpdateMealEntry({ ...mealEntry, ingredients });
  };

  const handleNutritionChange = (
    nutrition: BaseNutritionInputsState | BaseNutrition
  ) => {
    setBaseNutrition(nutrition as BaseNutrition);
    onUpdateMealEntry({
      ...mealEntry,
      calories: Number(nutrition.calories) || 0,
      protein: Number(nutrition.protein) || 0,
      carbs: Number(nutrition.carbs) || 0,
      fat: Number(nutrition.fat) || 0,
      fiber: Number(nutrition.fiber) || 0,
    });
  };

  return (
    <div className="border bg-stone-50 p-4 pt-6 rounded-md relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemoveMealEntry}
        className="absolute top-1 right-1"
      >
        <X />
      </Button>

      <div className="space-y-4">
        {/* Search food name */}
        <section className="space-y-1">
          <Label className="text-sm">Food Name</Label>
          <FoodSearch
            value={foodName}
            onChange={setFoodName}
            onSelect={(food) => {
              console.log(food);
              setFoodName(food.foodName);
              setPortions(food.portions);
              // Set default portion if available
              if (food.portions.length > 0) {
                setSelectedPortion(food.portions[0]);
              }

              const nutrition: BaseNutrition = {
                calories: food.calories?.quantity || 0,
                protein:
                  food.constituents.find((n) => n.nutrientId === 'Protein')
                    ?.quantity || 0,
                carbs:
                  food.constituents.find((n) => n.nutrientId === 'Karbo')
                    ?.quantity || 0,
                fat:
                  food.constituents.find((n) => n.nutrientId === 'Fett')
                    ?.quantity || 0,
                fiber:
                  food.constituents.find((n) => n.nutrientId === 'Fiber')
                    ?.quantity || 0,
              };
              setBaseNutrition(nutrition);
              onUpdateMealEntry({
                ...mealEntry,
                name: food.foodName,
                ...nutrition,
              });
            }}
            onClear={() => {
              setFoodName('');
              setPortions([]);
              const emptyNutrition: BaseNutrition = {
                calories: '' as unknown as number,
                protein: '' as unknown as number,
                carbs: '' as unknown as number,
                fat: '' as unknown as number,
                fiber: '' as unknown as number,
              };
              setBaseNutrition(emptyNutrition);
              onUpdateMealEntry({
                ...mealEntry,
                name: '',
                ...emptyNutrition,
              });
            }}
          />
        </section>

        {portions.length > 0 && (
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label className="text-sm">Portion Type</Label>
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

            <div className="w-24 space-y-1">
              <Label className="text-sm">Amount</Label>
              <Input
                type="number"
                min={0}
                value={portionAmount === 0 ? '' : portionAmount}
                onChange={(e) => {
                  const amount =
                    e.target.value === '' ? 0 : Number(e.target.value);
                  setPortionAmount(amount);
                  if (selectedPortion) {
                    const multiplier =
                      amount * (selectedPortion.quantity / 100);
                    const updatedNutrition: BaseNutrition = {
                      calories: baseNutrition.calories * multiplier,
                      protein: baseNutrition.protein * multiplier,
                      carbs: baseNutrition.carbs * multiplier,
                      fat: baseNutrition.fat * multiplier,
                      fiber: baseNutrition.fiber * multiplier,
                    };
                    setBaseNutrition(updatedNutrition);
                    onUpdateMealEntry({
                      ...mealEntry,
                      ...updatedNutrition,
                    });
                  }
                }}
              />
            </div>
          </div>
        )}

        <Tabs defaultValue={Tab.storeBought} className="w-full">
          <TabsList className="grid w-full grid-cols-2 border min-h-max">
            <TabsTrigger value={Tab.storeBought}>{Tab.storeBought}</TabsTrigger>
            <TabsTrigger value={Tab.homemade}>{Tab.homemade}</TabsTrigger>
          </TabsList>
          <TabsContent value={Tab.homemade}>
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
                  <AddIngredients
                    onAddIngredient={handleAddIngredient}
                    entryType={mealEntry.entryType}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value={Tab.storeBought}>
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
                    onChange={handleNutritionChange}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FoodEntryEditor;
