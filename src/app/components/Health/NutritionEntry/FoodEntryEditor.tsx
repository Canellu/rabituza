import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BaseNutrition, Ingredient, MealEntry } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';
import AddIngredients from './AddIngredients';
import BaseNutritionInputs from './BaseNutritionInputs';

interface FoodEntryEditorProps {
  mealEntry: MealEntry;
  onUpdateMealEntry: (mealEntry: MealEntry) => void;
  onRemoveMealEntry: () => void;
}

const Tab = {
  homemade: 'Homemade',
  storeBought: 'Store Bought',
};

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

  const handleAddIngredient = (ingredients: Ingredient[]) => {
    setIngredients(ingredients);
    onUpdateMealEntry({ ...mealEntry, ingredients });
  };

  const handleUpdateMealEntryClick = () => {
    const updatedEntry: MealEntry = {
      ...mealEntry,
      name: foodName,
      ...baseNutrition,
      ingredients,
    };
    onUpdateMealEntry(updatedEntry);
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
        <div className="space-y-1">
          <Label className="text-sm">Food Name</Label>
          <Input
            type="text"
            placeholder="Fried chicken"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            onBlur={handleUpdateMealEntryClick}
            className="border rounded-md p-2"
          />
        </div>

        <Tabs defaultValue={Tab.storeBought} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
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
                    onChange={(nutrition) => {
                      setBaseNutrition(nutrition);
                      onUpdateMealEntry({ ...mealEntry, ...nutrition });
                    }}
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
