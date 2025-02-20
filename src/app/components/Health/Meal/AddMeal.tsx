'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Import Dialog components
import { createNutrition } from '@/lib/database/nutrition/nutrients/createNutrition';
import { getSession } from '@/lib/utils/userSession';
import { Meal, MealItem, MealType, MealTypes } from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DateTimePicker from '../../DateTimePicker';
import NotesInput from '../../NotesInput';
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
    console.log('Submit');
    if (!userId || !mealType) return;
    console.log(userId, mealType);

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

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm(); // Reset form when dialog is closed
        }}
      >
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            <div className="h-full overflow-auto">
              <div className="flex flex-col gap-4 p-4">
                <DateTimePicker date={mealDate} onDateChange={setMealDate} />

                <MealTypeSelector
                  selectedMealType={mealType}
                  onMealTypeChange={setMealType}
                />

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddMealItem()}
                >
                  Add to Meal
                </Button>
                <div className="bg-stone-50 rounded-md border p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    {mealItems.map((item, index) => (
                      <MealItemEditor
                        key={index}
                        mealItem={item}
                        onUpdateMealItem={(updatedItem) =>
                          handleUpdateMealItem(index, updatedItem)
                        }
                        onRemoveMealItem={() => handleRemoveMealItem(index)}
                      />
                    ))}
                  </div>
                </div>

                <NotesInput note={notes} onNoteChange={setNotes} />

                <SaveButtonDrawer
                  title="Save Meal"
                  isPending={isPending}
                  isDisabled={
                    mealItems.length === 0 ||
                    mealItems.some(
                      (item) => item.name === '' || item.calories === 0
                    )
                  }
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMeal;
