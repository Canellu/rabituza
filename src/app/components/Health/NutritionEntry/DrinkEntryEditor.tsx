import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BaseNutrition, Ingredient, MealEntry } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';
import AddIngredients from './AddIngredients';

interface DrinkEntryEditorProps {
  mealEntry: MealEntry;
  onUpdateMealEntry: (mealEntry: MealEntry) => void;
  onRemoveMealEntry: () => void;
}

const DrinkEntryEditor = ({
  mealEntry,
  onUpdateMealEntry,
  onRemoveMealEntry,
}: DrinkEntryEditorProps) => {
  const [mealName, setMealName] = useState(mealEntry.name);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition>({
    calories: mealEntry.calories,
    protein: mealEntry.protein,
    carbs: mealEntry.carbs,
    fat: mealEntry.fat,
    fiber: mealEntry.fiber,
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    mealEntry.ingredients || [] // Add default empty array
  );

  const handleAddIngredient = (ingredients: Ingredient[]) => {
    setIngredients(ingredients);
    onUpdateMealEntry({ ...mealEntry, ingredients });
  };

  const handleUpdateMealEntryClick = () => {
    const updatedEntry: MealEntry = {
      ...mealEntry,
      name: mealName,
      ...baseNutrition,
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
        {/* Entry name */}
        <div className="space-y-1">
          <Label className="text-sm">Drink Name</Label>
          <Input
            type="text"
            placeholder="Sugar Free Coke"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            onBlur={handleUpdateMealEntryClick}
            className="border rounded-md p-2"
          />
        </div>

        <Accordion
          type="single"
          defaultValue="nutrition"
          collapsible
          className="space-y-2"
        >
          {/* Accordion for Base Nutrition Inputs */}
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
              {/* <BaseNutritionInputs
                onChange={(nutrition) => {
                  setBaseNutrition(nutrition);
                  onUpdateMealEntry({ ...mealEntry, ...nutrition });
                }}
              /> */}
            </AccordionContent>
          </AccordionItem>

          {/* Accordion for Ingredients */}
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
      </div>
    </div>
  );
};

export default DrinkEntryEditor;
