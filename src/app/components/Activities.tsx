'use client';

import { getActivities } from '@/lib/database/activities/getActivities';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';

import { ActivityTypes } from '@/types/Activity';
import ActivityCardBouldering from './ActivityCardBouldering';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
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
    // TODO: Add skeleton to prevent layout shift
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
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-3">Recent activities</h2>
      <div className="space-y-4 pb-10">
        {activities?.map((activity) => {
          if (activity.type === ActivityTypes.Bouldering) {
            return (
              <ActivityCardBouldering key={activity.id} activity={activity} />
            );
          }
          if (activity.type === ActivityTypes.Calisthenics) {
            return (
              <ActivityCardCalisthenics key={activity.id} activity={activity} />
            );
          }
          // Add other activity type handlers here
          return null;
        })}
      </div>
    </div>
  );
};

export default Activities;
