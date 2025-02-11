'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddNutritionTarget } from './Nutrition/AddNutritionTarget';
import NutritionMonth from './Nutrition/NutritionMonth';
import NutritionWeek from './Nutrition/NutritionWeek';
import NutritionYear from './Nutrition/NutritionYear';
import WorkInProgress from './WorkInProgress';

const Health = () => {
  return (
    <div className="h-full space-y-10">
      <WorkInProgress />
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
            <NutritionWeek />
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
