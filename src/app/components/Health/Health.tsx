'use client';

import { Button } from '@/components/ui/button';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import WorkInProgress from '../WorkInProgress';
import { AddNutritionTarget } from './AddNutritionTarget';
import NutritionDayPicker from './NutritionDayPicker';
import NutritionMonth from './NutritionMonth';
import NutritionStats from './NutritionStats';

const Health = () => {
  const userId = getSession();
  const {
    data: nutritionTargets = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ['nutritionTargets', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is null');
      return getNutritionTargets(userId);
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
      <WorkInProgress />
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

      <div className="flex flex-col gap-4">
        <AddMeal title="Breakfast" handleAddMeal={() => {}} />
        <AddMeal title="Lunch" handleAddMeal={() => {}} />
        <AddMeal title="Dinner" handleAddMeal={() => {}} />
        <AddMeal title="Snacks" handleAddMeal={() => {}} />
      </div>

      <NutritionMonth target={nutritionTarget} />
    </div>
  );
};

const AddMeal = ({
  title,
  handleAddMeal,
}: {
  title: string;
  handleAddMeal: () => void;
}) => {
  return (
    <div className="bg-white border p-5 rounded-2xl text-stone-800 flex flex-col justify-between gap-4">
      <div className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-stone-600">0 kcal</span>
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

        <Button
          size="icon"
          variant="secondary"
          onClick={handleAddMeal}
          className="rounded-full"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default Health;
