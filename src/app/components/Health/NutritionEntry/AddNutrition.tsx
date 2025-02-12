'use client';

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
import AddMealEntry from './AddMealEntry';
import EntryTypeSelector from './EntryTypeSelector';
import MealTypeSelector from './MealTypeSelector';

const AddNutrition = () => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState<MealType>(MealTypes.Breakfast);
  const [entryType, setEntryType] = useState<MealEntryType>(
    MealEntryTypes.Food
  );

  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
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

  const handleSubmit = () => {
    if (!userId || !mealType) return;

    const data = {
      mealDate,
      mealType,
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
                  onAddEntryType={() => {}}
                />

                <AddMealEntry
                  entryType={'food'}
                  onAddMealEntry={function (mealEntry: MealEntry): void {
                    throw new Error('Function not implemented.');
                  }}
                />

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
