'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getNutrition } from '@/lib/database/nutrition/nutrients/getNutrition';
import { getNutritionTargets } from '@/lib/database/nutrition/targets/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { Meal } from '@/types/Nutrition';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MealForm from './Meal/MealForm';
import MealCard from './MealCard';
import NutritionMonth from './NutritionMonth';
import NutritionStats from './NutritionStats';
import { AddNutritionTarget } from './NutritionTarget/AddNutritionTarget';
import NutritionDayPicker from './NutritionTarget/NutritionDayPicker';

const Health = () => {
  const userId = getSession();
  const { data: nutritionTargets = [], isLoading } = useQuery({
    queryKey: ['nutritionTargets', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is null');
      return getNutritionTargets(userId);
    },
    enabled: !!userId,
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['nutrients', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is null');
      return getNutrition(userId);
    },
    enabled: !!userId,
  });

  const today = new Date();
  // Start the week 3 days before today
  const [selectedDate, setSelectedDate] = useState(today);
  const nutritionTarget = nutritionTargets[0];
  const isInTargetPeriod =
    selectedDate >= nutritionTarget?.startDate &&
    selectedDate <= nutritionTarget?.endDate;

  const todaysMeals = meals.filter(
    (meal) => meal.mealDate.toDateString() === selectedDate.toDateString()
  );
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsMealDialogOpen(true);
  };

  return (
    <div className="p-6 h-full space-y-10">
      <NutritionDayPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <NutritionStats
        meals={meals}
        isLoading={isLoading}
        nutritionTarget={nutritionTarget}
        isInTargetPeriod={isInTargetPeriod}
        selectedDay={selectedDate}
      />

      {!isLoading && (
        <section
          className={cn(
            'flex justify-center w-full items-center',
            isInTargetPeriod && 'hidden'
          )}
        >
          <AddNutritionTarget />
        </section>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Meals</h2>
        {todaysMeals.length > 0 ? (
          <div className="flex flex-col gap-2">
            {todaysMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onEdit={() => handleEditMeal(meal)}
              />
            ))}
          </div>
        ) : (
          <div className="border p-4 bg-white rounded-xl">
            <span className="text-sm font-medium text-stone-600 ">
              No meals added on this date
            </span>
          </div>
        )}
      </div>

      <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Edit Meal</DialogTitle>
            <DialogDescription className="sr-only">Edit Meal</DialogDescription>
          </DialogHeader>
          {selectedMeal && (
            <MealForm
              initialMeal={selectedMeal}
              onClose={() => setIsMealDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <NutritionMonth
        meals={meals}
        target={nutritionTarget}
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Health;
