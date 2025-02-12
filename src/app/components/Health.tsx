'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { motion } from 'framer-motion'; // Import framer-motion
import { useState } from 'react';
import { AddNutritionTarget } from './Nutrition/AddNutritionTarget';
import NutritionMonth from './Nutrition/NutritionMonth';
import NutritionWeek from './Nutrition/NutritionWeek';
import NutritionYear from './Nutrition/NutritionYear';

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
  const weekStart = addDays(today, -3);
  const [selectedDay, setSelectedDay] = useState(today);
  const nutritionTarget = nutritionTargets[0];

  return (
    <div className="h-full space-y-10">
      <div className="grid grid-cols-7 items-center justify-between gap-1 relative">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(weekStart, i);
          const isSelected =
            format(date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd');
          const isToday =
            format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

          return (
            <div
              key={i}
              className={cn(
                isSelected ? '' : 'text-stone-700',
                'relative py-3 flex flex-col gap-2 rounded-2xl items-center justify-center isolate'
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={() => setSelectedDay(date)}
            >
              <span
                className={cn(
                  'text-[10px]',
                  isSelected ? 'font-semibold text-lime-800' : ''
                )}
              >
                {isToday ? 'Today' : format(date, 'EEEEEE')}
              </span>
              <span
                className={cn(
                  'text-sm transition-colors duration-200 ease-in-out',
                  isSelected ? 'font-semibold text-lime-800' : ''
                )}
              >
                {format(date, 'd')}
              </span>
              {isSelected && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 -z-10 bg-gradient-to-b border border-white/5 from-white/30 to-transparent backdrop-blur-sm mix-blend-difference rounded-2xl"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.4,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* {!nutritionTarget ? ( */}
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <p className="text-7xl font-semibold text-lime-900 text-center">
            {nutritionTarget ? (
              nutritionTarget.calories
            ) : (
              <Skeleton className="w-40 h-14 rounded-md bg-stone-100/80" />
            )}
          </p>
          <span className="text-lime-900 text-sm">remaining calories</span>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full text-stone-700 ">
          <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
            <span className="text-xs text-lime-800">Carbs</span>
            <span className="font-medium text-sm text-lime-900">
              {nutritionTarget.carbs}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
            <span className="text-xs text-lime-800">Protein</span>
            <span className="font-medium text-sm text-lime-900">
              {nutritionTarget.protein}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
            <span className="text-xs text-lime-800">Fat</span>
            <span className="font-medium text-sm text-lime-900">
              {nutritionTarget.fat}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
            <span className="text-xs text-lime-800">Fiber</span>
            <span className="font-medium text-sm text-lime-900">
              {nutritionTarget.fiber}
            </span>
          </div>
        </div>
      </div>

      <section className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nutrition plan</h2>
        <AddNutritionTarget />
      </section>

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
