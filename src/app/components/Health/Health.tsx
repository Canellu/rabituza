'use client';

import { getNutrition } from '@/lib/database/nutrition/nutrients/getNutrition';
import { getNutritionTargets } from '@/lib/database/nutrition/targets/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
  const [selectedDay, setSelectedDay] = useState(today);
  const nutritionTarget = nutritionTargets[0];
  const isInTargetPeriod =
    selectedDay >= nutritionTarget?.startDate &&
    selectedDay <= nutritionTarget?.endDate;

  const todaysMeals = meals.filter(
    (meal) => meal.mealDate.toDateString() === selectedDay.toDateString()
  );

  return (
    <div className="h-full space-y-10">
      <NutritionDayPicker
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      <NutritionStats
        meals={meals}
        isLoading={isLoading}
        nutritionTarget={nutritionTarget}
        isInTargetPeriod={isInTargetPeriod}
        selectedDay={selectedDay}
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
            {todaysMeals
              .filter(
                (meal) =>
                  meal.mealDate.toDateString() === selectedDay.toDateString()
              )
              .map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
          </div>
        ) : (
          <div className="border p-4 bg-white rounded-xl">
            <span className="text-sm font-medium text-stone-600 ">
              No meals addded on this date
            </span>
          </div>
        )}
      </div>
      <NutritionMonth target={nutritionTarget} />
    </div>
  );
};

export default Health;
