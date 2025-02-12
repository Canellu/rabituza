'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddNutritionTarget } from './AddNutritionTarget';
import NutritionDayPicker from './NutritionDayPicker';
import NutritionMonth from './NutritionMonth';
import NutritionStats from './NutritionStats';
import NutritionWeek from './NutritionWeek';
import NutritionYear from './NutritionYear';

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
      <NutritionDayPicker
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      <NutritionStats
        isLoading={isLoading}
        nutritionTarget={nutritionTarget}
        isInTargetPeriod={isInTargetPeriod}
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

      <section className="space-y-4">
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="week" className="flex-grow">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-grow">
              Month
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-grow">
              Year
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            <NutritionWeek targets={nutritionTargets} />
          </TabsContent>
          <TabsContent value="month">
            <NutritionMonth />
          </TabsContent>
          <TabsContent value="year">
            <NutritionYear />
          </TabsContent>
        </Tabs>
      </section>
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
    <div className="bg-gradient-to-b from-stone-100 to-lime-500/30 p-5 rounded-2xl text-stone-800 flex flex-col justify-between gap-4">
      <div className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-stone-600">0 kcal</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="flex gap-1">
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 px-2.5 py-1.5">
            <span className="text-stone-500">Carbs</span>
            <span className="font-medium">0%</span>
          </div>
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 px-2.5 py-1.5">
            <span className="text-stone-500">Protein</span>
            <span className="font-medium">0%</span>
          </div>
          <div className="space-x-1 text-[10px] rounded-full bg-stone-50 px-2.5 py-1.5">
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
