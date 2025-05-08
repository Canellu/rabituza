import { Button } from '@/components/ui/button';
import { createNutrition } from '@/lib/database/nutrition/nutrients/createNutrition';
import { updateNutrition } from '@/lib/database/nutrition/nutrients/updateNutrition'; // Import update function
import { getSession } from '@/lib/utils/userSession';
import { Meal, MealItem, MealType, MealTypes } from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import DateTimePicker from '../../DateTimePicker';
import NotesInput from '../../NotesInput';
import SaveButtonDrawer from '../../SaveButtonDrawer';
import MealItemEditor from './MealItemEditor';
import MealTypeSelector from './MealTypeSelector';

interface MealFormProps {
  initialMeal?: Meal;
  onClose: () => void;
}

const MealForm = ({ initialMeal, onClose }: MealFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [mealDate, setMealDate] = useState(initialMeal?.mealDate || new Date());
  const [mealType, setMealType] = useState<MealType>(
    initialMeal?.mealType || MealTypes.Breakfast
  );
  const [mealItems, setMealItems] = useState<MealItem[]>(
    initialMeal?.mealItems || []
  );
  const [notes, setNotes] = useState(initialMeal?.notes || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: Omit<Meal, 'userId' | 'createdAt' | 'updatedAt' | 'id'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      if (initialMeal?.id) {
        return updateNutrition(userId, initialMeal.id, data);
      } else {
        return createNutrition(userId, data);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['nutrients', userId],
        exact: true,
      });
      onClose();
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
    if (!userId) return;

    const data = {
      mealDate,
      mealType,
      mealItems,
      notes,
    };

    mutate(data);
  };

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="h-full overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          <DateTimePicker date={mealDate} onDateChange={setMealDate} />

          <MealTypeSelector
            selectedMealType={mealType}
            onMealTypeChange={setMealType}
          />

          <div className="bg-stone-50 rounded-md border p-4 flex flex-col gap-3 dark:bg-stone-800 dark:border-transparent">
            <div className="flex justify-between items-center">
              <h2 className="font-medium flex items-center gap-2">
                Add items to meal
              </h2>
              <Button
                size="icon"
                variant="outline"
                onClick={handleAddMealItem}
                disabled={mealItems.some(
                  (item) => item.name === '' || item.calories === 0
                )}
              >
                <Plus />
              </Button>
            </div>
            {!!mealItems.length && (
              <div className="flex flex-col gap-1">
                <AnimatePresence mode="wait" initial={false}>
                  {mealItems.map((item, index) => (
                    <MealItemEditor
                      key={`${item.name}-${index}`}
                      mealItem={item}
                      onUpdateMealItem={(updatedItem) =>
                        handleUpdateMealItem(index, updatedItem)
                      }
                      onRemoveMealItem={() => handleRemoveMealItem(index)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <NotesInput note={notes} onNoteChange={setNotes} />

          <SaveButtonDrawer
            title="Save Meal"
            isPending={isPending}
            isDisabled={
              mealItems.length === 0 ||
              mealItems.some((item) => item.name === '' || item.calories === 0)
            }
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default MealForm;
