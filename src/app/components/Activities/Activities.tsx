'use client';

// Change the import from drawer to dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  STAGGER_CHILD_VARIANTS,
  STAGGER_CONTAINER_CONFIG,
} from '@/constants/animationConfig';
import { getActivities } from '@/lib/database/activities/getActivities';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType, ActivityTypes } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Spinner from '../Spinner';
import ActivitiesMonth from './ActivitiesMonth';
import AcitvitiesWeek from './ActivitiesWeek';
import ActivitiesYear from './ActivitiesYear';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
import ActivityCardClimbing from './ActivityCardClimbing';
import ActivityCardDriving from './ActivityCardDriving';
import ActivityCardGym from './ActivityCardGym';
import ActivityCardHangboard from './ActivityCardHangboard';
import ActivityCardStretching from './ActivityCardStretching';
import ActivityForm from './ActivityForm';

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );
  // Rename isDrawerOpen to isOpen for consistency
  const [isOpen, setIsOpen] = useState(false);

  const userId = getSession();
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', userId],
    queryFn: () => (userId ? getActivities(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 0,
  });

  const handleEditActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setIsOpen(true);
  };

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
                      return (
                        <ActivityCardClimbing
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );
                    case ActivityTypes.Calisthenics:
                      return (
                        <ActivityCardCalisthenics
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );
                    case ActivityTypes.Stretching:
                      return (
                        <ActivityCardStretching
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );
                    case ActivityTypes.Hangboard:
                      return (
                        <ActivityCardHangboard
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );

                    case ActivityTypes.Gym:
                      return (
                        <ActivityCardGym
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );

                    case ActivityTypes.Driving:
                      return (
                        <ActivityCardDriving
                          activity={activity}
                          onEdit={() => handleEditActivity(activity)}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <ActivityForm
                    selectedActivity={selectedActivity}
                    onClose={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
