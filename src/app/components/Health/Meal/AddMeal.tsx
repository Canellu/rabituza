'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { createNutrition } from '@/lib/database/nutrition/nutrients/createNutrition';
import { getSession } from '@/lib/utils/userSession';
import { Meal, MealItem, MealType, MealTypes } from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DateTimePicker from '../../DateTimePicker';
import NotesInput from '../../NotesInput';
import * as ResizablePanel from '../../ResizablePanel';
import SaveButtonDrawer from '../../SaveButtonDrawer';
import MealItemEditor from './MealItemEditor';
import MealTypeSelector from './MealTypeSelector';

const AddMeal = () => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState<MealType>(MealTypes.Breakfast);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [notes, setNotes] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      return createNutrition(userId, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['nutrients', userId],
        exact: true,
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error processing nutrition:', error);
    },
  });

  const handleAddMealItem = () => {
    const newItem: MealItem = {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
    setMealItems([...mealItems, newItem]);
  };

  const handleUpdateMealItem = (index: number, updatedEntry: MealItem) => {
    const updatedEntries = [...mealItems];
    updatedEntries[index] = updatedEntry;
    setMealItems(updatedEntries);
  };

  const handleRemoveMealItem = (index: number) => {
    setMealItems(mealItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!userId || !mealType) return;

    const data = {
      mealDate,
      mealType,
      mealItems,
      notes,
    };

    mutate(data);
  };

  const resetForm = () => {
    setMealDate(new Date());
    setMealType(MealTypes.Breakfast);
    setMealItems([]);
    setNotes('');
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Add meal
      </Button>

      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm(); // Reset form when drawer is closed
        }}
      >
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Add Meal</DrawerTitle>
          </DrawerHeader>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4 pb-16 h-full overflow-auto">
              <div className="flex flex-col gap-4">
                <DateTimePicker date={mealDate} onDateChange={setMealDate} />

                <MealTypeSelector
                  selectedMealType={mealType}
                  onMealTypeChange={setMealType}
                />

                <div className="bg-stone-50 rounded-md border p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="">Meal items</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="max-w-max"
                      onClick={() => handleAddMealItem()}
                    >
                      Add to Meal
                    </Button>
                  </div>
                  {mealItems.length > 0 && (
                    <ResizablePanel.Root value={'mealItems'}>
                      <ResizablePanel.Content value="mealItems">
                        <div className="flex flex-col gap-2">
                          {mealItems.map((item, index) => (
                            <MealItemEditor
                              key={index}
                              mealItem={item}
                              onUpdateMealItem={(updatedItem) =>
                                handleUpdateMealItem(index, updatedItem)
                              }
                              onRemoveMealItem={() =>
                                handleRemoveMealItem(index)
                              }
                            />
                          ))}
                        </div>
                      </ResizablePanel.Content>
                    </ResizablePanel.Root>
                  )}
                </div>

                <NotesInput note={notes} onNoteChange={setNotes} />

                <SaveButtonDrawer
                  title="Save Meal"
                  isPending={isPending}
                  isDisabled={mealItems.length === 0}
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

export default AddMeal;
