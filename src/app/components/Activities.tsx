'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActivities } from '@/lib/database/activities/getActivities';
import { getSession } from '@/lib/utils/userSession';
import { ActivityTypes } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import ActivitiesMonth from './ActivitiesMonth';
import AcitvitiesWeek from './ActivitiesWeek';
import ActivitiesYear from './ActivitiesYear';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
import ActivityCardClimbing from './ActivityCardClimbing';
import Spinner from './Spinner';

const Activities = () => {
  const userId = getSession();
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', userId],
    queryFn: () => (userId ? getActivities(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col gap-4 h-full">
        <Spinner />
        <span className="text-stone-500 font-medium text-sm">
          Loading activities...
        </span>
      </div>
    );
  }

  return (
    <div className="h-full space-y-10">
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
            <AcitvitiesWeek activities={activities} />
          </TabsContent>
          <TabsContent value="month">
            <ActivitiesMonth activities={activities} />
          </TabsContent>
          <TabsContent value="year">
            <ActivitiesYear activities={activities} />
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent activities</h2>
        <div className="space-y-4 pb-10">
          {activities?.map((activity) => {
            if (activity.type === ActivityTypes.Climbing) {
              return (
                <ActivityCardClimbing key={activity.id} activity={activity} />
              );
            }
            if (activity.type === ActivityTypes.Calisthenics) {
              return (
                <ActivityCardCalisthenics
                  key={activity.id}
                  activity={activity}
                />
              );
            }
            return null;
          })}
        </div>
      </section>
    </div>
  );
};

export default Activities;
