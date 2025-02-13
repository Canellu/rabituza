'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { createNutrition } from '@/lib/database/nutrition/createNutrition';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseNutrition,
  MealEntry,
  MealEntryType,
  MealEntryTypes,
  MealType,
  MealTypes,
  NutritionEntry,
} from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DateTimePicker from '../../DateTimePicker';
import NotesInput from '../../NotesInput';
import SaveButtonDrawer from '../../SaveButtonDrawer';
import BaseNutritionInputs from './BaseNutritionInputs';
import EntryTypeSelector from './EntryTypeSelector';
import MealTypeSelector from './MealTypeSelector';

const AddNutrition = () => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [entryType, setEntryType] = useState<MealEntryType>(
    MealEntryTypes.Food
  );

  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState<MealType>(MealTypes.Breakfast);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [baseNutrition, setBaseNutrition] = useState<BaseNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });
  const [note, setNote] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: Omit<NutritionEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      return createNutrition(userId, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['nutrition', userId],
        exact: true,
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error processing nutrition:', error);
    },
  });

  const handleAddMealEntry = (entry: MealEntry) => {
    setMealEntries([...mealEntries, entry]);
  };

  const handleRemoveMealEntry = (index: number) => {
    setMealEntries(mealEntries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!userId || !mealType) return;

    const data = {
      mealType,
      mealDate,
      mealEntries,
      notes: note,
    };

    mutate(data);
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Add meal
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="ixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Add Meal</DrawerTitle>
          </DrawerHeader>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4 pb-16 h-full overflow-auto">
              <div className="flex flex-col gap-4">
                <DateTimePicker date={mealDate} onDateChange={setMealDate} />

                {/* Meal Type Selection */}
                <MealTypeSelector
                  selectedMealType={mealType}
                  onMealTypeChange={setMealType}
                />

                {/* Entry Type Selection */}
                <EntryTypeSelector
                  selectedEntryType={entryType}
                  onEntryTypeChange={setEntryType}
                />

                {/* Accordion for Base Nutrition Inputs */}
                <Accordion type="multiple" className="space-y-2">
                  <AccordionItem value="nutrition" className="border-none">
                    <AccordionTrigger className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 text-start hover:no-underline border rounded-md p-3 bg-stone-50 text-sm">
                      Nutrition
                    </AccordionTrigger>
                    <AccordionContent>
                      <BaseNutritionInputs onChange={setBaseNutrition} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Accordion for Ingredients */}
                  <AccordionItem value="ingredients" className="border-none">
                    <AccordionTrigger className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 text-start hover:no-underline border rounded-md p-3 bg-stone-50 text-sm">
                      Ingredients
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* Placeholder for Ingredients */}
                      <div>Ingredients content goes here...</div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <NotesInput note={note} onNoteChange={setNote} />

                <SaveButtonDrawer
                  title="Save Meal"
                  isPending={isPending}
                  isDisabled={mealEntries.length === 0}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddNutrition;
