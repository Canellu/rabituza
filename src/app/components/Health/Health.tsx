'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
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

      <div className="grid grid-cols-2">
        <div>Breakfast</div>
        <div>Lunch</div>
        <div>Dinner</div>
        <div>Snacks</div>
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

export default Health;
