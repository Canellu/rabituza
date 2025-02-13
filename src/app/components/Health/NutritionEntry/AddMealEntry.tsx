import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  BaseNutrition,
  Ingredient,
  MealEntry,
  MealEntryType,
} from '@/types/Nutrition';
import { useState } from 'react';
import AddIngredients from './AddIngredients';
import BaseNutritionInputs from './BaseNutritionInputs';

interface AddMealEntryProps {
  entryType: MealEntryType;
  onAddMealEntry: (mealEntry: MealEntry) => void;
}

const AddMealEntry = ({ onAddMealEntry, entryType }: AddMealEntryProps) => {
  const [mealName, setMealName] = useState(''); // New state for meal name
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleAddMealEntryClick = () => {
    const mealEntry: MealEntry = {
      name: mealName,
      entryType,
      ...baseNutrition,
      ingredients,
    };
    onAddMealEntry(mealEntry);
    setMealName('');
    setBaseNutrition({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    });
    setIngredients([]);
  };

  return (
    <div className="border bg-stone-50 p-4 rounded-md space-y-4">
      {/* Entry name */}
      <div className="space-y-1 ">
        <Label className="text-sm">Name</Label>
        <Input
          type="text"
          placeholder="Fried chicken / Sugar Free Coke"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
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
            <BaseNutritionInputs onChange={setBaseNutrition} />
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
            <AddIngredients onAddIngredient={handleAddIngredient} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddMealEntry;
