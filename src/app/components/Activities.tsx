'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  STAGGER_CHILD_VARIANTS,
  STAGGER_CONTAINER_CONFIG,
} from '@/constants/animationConfig';
import { getActivities } from '@/lib/database/activities/getActivities';
import { getSession } from '@/lib/utils/userSession';
import { ActivityTypes } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import ActivitiesMonth from './ActivitiesMonth';
import AcitvitiesWeek from './ActivitiesWeek';
import ActivitiesYear from './ActivitiesYear';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
import ActivityCardClimbing from './ActivityCardClimbing';
import ActivityCardStretching from './ActivityCardStretching';
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
        <motion.div className="space-y-4 pb-10" {...STAGGER_CONTAINER_CONFIG}>
          <AnimatePresence>
            {activities?.map((activity) => (
              <motion.div key={activity.id} variants={STAGGER_CHILD_VARIANTS}>
                {(() => {
                  switch (activity.type) {
                    case ActivityTypes.Climbing:
                      return <ActivityCardClimbing activity={activity} />;
                    case ActivityTypes.Calisthenics:
                      return <ActivityCardCalisthenics activity={activity} />;
                    case ActivityTypes.Stretching:
                      return <ActivityCardStretching activity={activity} />;
                    default:
                      return null;
                  }
                })()}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
};

export default Activities;
