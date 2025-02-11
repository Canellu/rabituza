'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNutritionTargets } from '@/lib/database/nutrition/getNutritionTargets';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { AddNutritionTarget } from './Nutrition/AddNutritionTarget';
import NutritionMonth from './Nutrition/NutritionMonth';
import NutritionWeek from './Nutrition/NutritionWeek';
import NutritionYear from './Nutrition/NutritionYear';
import Spinner from './Spinner';
import WorkInProgress from './WorkInProgress';

const Health = () => {
  const userId = getSession();

  const {
    data: nutritionTargets,
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <Spinner />
        <span className="text-stone-500">Fetching goals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        Error loading nutrition targets
      </div>
    );
  }

  console.log(nutritionTargets);

  return (
    <>
      <WorkInProgress />
      <div className="h-full space-y-10">
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
    </>
  );
};

export default Health;
