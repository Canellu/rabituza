'use client';

import { getNutrition } from '@/lib/database/nutrition/nutrients/getNutrition';
import { getNutritionTargets } from '@/lib/database/nutrition/targets/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
    queryKey: ['meals', userId],
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

  useEffect(() => {
    console.log(meals, meals.length);
  }, [meals]);

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

      {meals.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Today&apos;s Meals</h2>
          <div className="flex flex-col gap-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      )}
      <NutritionMonth target={nutritionTarget} />
    </div>
  );
};

export default Health;
