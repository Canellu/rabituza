'use client';

import { getNutrition } from '@/lib/database/nutrition/nutrients/getNutrition';
import { getNutritionTargets } from '@/lib/database/nutrition/targets/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { Frown } from 'lucide-react';
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

  useEffect(() => {
    console.log(meals, meals.length);
  }, [meals]);

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
          <div className="bg-secondary border rounded-xl p-4 white flex items-center gap-2 text-stone-600">
            <Frown className="size-5" />
            <span className="leading-none mt-px">
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
