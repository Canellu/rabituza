'use client';

import activityOptions from '@/constants/activityOptions';
import { getActivities } from '@/lib/database/activities/getActivities';
import { cn } from '@/lib/utils';
import getGradeColor from '@/lib/utils/getGradeColor';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import BOULDERING_GYMS from '@/constants/boulderingGyms';
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
      {/* Add activities list */}
      <div className="space-y-4">
        {activities?.map((activity) => {
          const { activityDate, type } = activity;
          const Icon = activityOptions.find((opt) => opt.id === type)?.icon;

          return (
            <div
              key={activity.id}
              className="border rounded-lg p-4 shadow-sm space-y-3 bg-secondary"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon className="text-primary size-7 rounded-md bg-gradient-to-br from-stone-50 to-stone-100 border p-1" />
                  )}
                  <span className="text-lg font-semibold inter text-stone-700">
                    {activityOptions.find((opt) => opt.id === type)?.label}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activityDate && format(activityDate, 'PP, HH:mm')}
                </span>
              </div>

              {/* Render activity-specific details */}
              {activity.type === 'bouldering' && (
                <div className="flex items-start flex-col text-sm text-muted-foreground capitalize gap-3">
                  <p className="text-base font-medium border border-stone-200/70 px-3 py-1 bg-stone-50 max-w-max rounded-sm flex items-center gap-1">
                    {activity.gym}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activity.grades
                      .sort((a, b) => {
                        const gymGrades =
                          BOULDERING_GYMS[
                            activity.gym as keyof typeof BOULDERING_GYMS
                          ].grades;
                        return (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          gymGrades.indexOf(a.grade) -
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          gymGrades.indexOf(b.grade)
                        );
                      })
                      .map((grade, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            'px-2 py-0.5 rounded-sm text-sm',
                            getGradeColor(grade.grade).text,
                            getGradeColor(grade.grade).bg
                          )}
                        >
                          {grade.grade} × {grade.count}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activities;
