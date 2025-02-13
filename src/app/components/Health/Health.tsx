'use client';

import { getNutrition } from '@/lib/database/nutrition/getNutrition';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { NutritionEntry } from '@/types/Nutrition';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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

  const { data: nutritionEntries = [] } = useQuery({
    queryKey: ['nutritionEntries', userId],
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

  return (
    <div className="h-full space-y-10">
      <NutritionDayPicker
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      <NutritionStats
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

      {nutritionEntries.length > 0 && (
        <div className="flex flex-col gap-4">
          <MealCard />
        </div>
      )}
      <NutritionMonth target={nutritionTarget} />
    </div>
  );
};

const MealCard = ({ meal }: { meal?: NutritionEntry }) => {
  if (!meal) return null;
  return (
    <div className="bg-white border p-5 rounded-xl text-stone-800 flex flex-col justify-between gap-4">
      <div className="flex flex-col">
        <span className="font-medium first-letter:capitalize">
          a{meal.mealType}
        </span>
        <span className="text-sm text-stone-600">Calories kcal</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="flex gap-1">
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 border px-2.5 py-1.5">
            <span className="text-stone-500">Carbs</span>
            <span className="font-medium">0%</span>
          </div>
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 border px-2.5 py-1.5">
            <span className="text-stone-500">Protein</span>
            <span className="font-medium">0%</span>
          </div>
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 border px-2.5 py-1.5">
            <span className="text-stone-500">Fat</span>
            <span className="font-medium">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
