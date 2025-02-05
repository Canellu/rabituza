'use client';

import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActivities } from '@/lib/database/activities/getActivities';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { ActivityTypes } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, isFuture, isToday, startOfWeek } from 'date-fns';
import { useState } from 'react';
import ActivityCardBouldering from './ActivityCardBouldering';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
import Spinner from './Spinner';

type ViewType = 'week' | 'month' | 'year';

const Activities = () => {
  const [view, setView] = useState<ViewType>('week');
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

  const renderActivitiesView = () => {
    const today = new Date();
    const currentYear = new Date().getFullYear();

    // Hoist these functions outside of the switch cases
    const datesWithActivities = new Set(
      activities?.map((activity) =>
        new Date(activity.activityDate).toLocaleDateString()
      )
    );

    const hasActivity = (date: Date) =>
      datesWithActivities.has(date.toLocaleDateString());

    const getActivityCount = (date: Date) => {
      return activities?.filter(
        (activity) =>
          new Date(activity.activityDate).toLocaleDateString() ===
          date.toLocaleDateString()
      ).length;
    };

    switch (view) {
      case 'year': {
        return (
          <div className="grid grid-cols-4 gap-4">
            {/* Year view - showing months as grid */}
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </h3>
                {/* Add activity dots or counts here */}
              </div>
            ))}
          </div>
        );
      }
      case 'month': {
        // Create a Set of dates that have activities (formatted as YYYY-MM-DD)
        const datesWithActivities = new Set(
          activities?.map(
            (activity) => new Date(activity.activityDate).toLocaleDateString() // Use localeDateString instead of ISO
          )
        );

        // Create a modifier function to check if a day has activities
        const hasActivity = (date: Date) =>
          datesWithActivities.has(date.toLocaleDateString()); // Use localeDateString for comparison

        // Add this function to count activities for a specific date
        const getActivityCount = (date: Date) => {
          return activities?.filter(
            (activity) =>
              new Date(activity.activityDate).toLocaleDateString() ===
              date.toLocaleDateString()
          ).length;
        };

        return (
          <Calendar
            mode="single"
            className="rounded-md border w-full flex items-center justify-center"
            showOutsideDays={false}
            fromDate={new Date(currentYear, 0, 1)}
            toDate={new Date(currentYear, 11, 31)}
            classNames={{
              head_row: 'flex space-x-1.5',
              row: 'flex w-full mt-2 space-x-1.5',
              day: 'size-9 rounded-full relative',
              cell: 'size-9 text-center text-sm p-0 relative',
              day_today: 'border-2 border-primary/50',
            }}
            modifiers={{ hasActivity }}
            modifiersClassNames={{
              hasActivity: cn('bg-primary/50 font-semibold'),
            }}
            components={{
              Day: ({ date, displayMonth }) => {
                const count = getActivityCount(date);
                const isOutsideDay =
                  displayMonth.getMonth() !== date.getMonth();
                const hasActivityForDay = hasActivity(date);
                const isTodayDate = isToday(date);

                if (isOutsideDay) return null;

                return (
                  <div className="relative">
                    <div
                      className={cn(
                        'flex items-center justify-center size-9 rounded-full',
                        hasActivityForDay && 'bg-primary/50 font-semibold',
                        isTodayDate && 'border-2 border-primary/50'
                      )}
                    >
                      {format(date, 'd')}
                    </div>
                    {count !== undefined && count > 0 && (
                      <div className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-medium">
                        {count}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        );
      }
      case 'week': {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });

        return (
          <div className="flex justify-between border p-4 rounded-md">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(weekStart, i);
              const isFutureDate = isFuture(date);
              const isCurrentDay = isToday(date);
              const hasActivityForDay = hasActivity(date);
              const count = getActivityCount(date);

              return (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col items-center gap-1',
                    isFutureDate && 'opacity-50'
                  )}
                >
                  <div className="text-sm font-medium text-stone-600">
                    {format(date, 'EEE')}
                  </div>
                  <div className="relative">
                    <div
                      className={cn(
                        'size-8 rounded-full flex items-center justify-center',
                        hasActivityForDay && 'bg-primary/50 font-semibold',
                        isCurrentDay && 'border-2 border-primary/50'
                      )}
                    >
                      <span className="text-sm font-medium">
                        {format(date, 'd')}
                      </span>
                    </div>
                    {count !== undefined && count > 0 && (
                      <div className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-medium">
                        {count}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    }
  };

  return (
    <div className="h-full space-y-6">
      <section className="space-y-4">
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
          className="w-full"
        >
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="week" className="flex-grow">
              WEEK
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-grow">
              MONTH
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-grow">
              YEAR
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {renderActivitiesView()}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent activities</h2>
        <div className="space-y-4 pb-10">
          {activities?.map((activity) => {
            if (activity.type === ActivityTypes.Bouldering) {
              return (
                <ActivityCardBouldering key={activity.id} activity={activity} />
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
