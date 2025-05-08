import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { addDays, format, isToday, startOfWeek } from 'date-fns';
import ActivityBadgeIcon from './ActivityBadgeIcon';
import ActivityBadgeNumber from './ActivityBadgeNumber';

type ActivitiesWeekProps = {
  activities?: ActivityType[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
};

const ActivitiesWeek = ({
  activities = [],
  onDateSelect,
  selectedDate,
}: ActivitiesWeekProps) => {
  const hasActivity = (date: Date) =>
    activities.some(
      (activity) =>
        new Date(activity.activityDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const getMostRecentActivityType = (date: Date) => {
    const dayActivities = activities.filter(
      (activity) =>
        new Date(activity.activityDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

    return dayActivities.sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    )[0]?.type;
  };

  const getActivityCount = (date: Date) => {
    return activities.filter(
      (activity) =>
        new Date(activity.activityDate).toLocaleDateString() ===
        date.toLocaleDateString()
    ).length;
  };

  return (
    <div className="flex justify-between border dark:border-none p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50 dark:from-emerald-800 dark:to-emerald-950">
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const isTodayDate = isToday(date);
        const isSelected =
          date.toLocaleDateString() === selectedDate.toLocaleDateString();
        const hasActivityForDay = hasActivity(date);
        const activityCount = getActivityCount(date);
        const mostRecentType = getMostRecentActivityType(date);

        return (
          <div
            key={i}
            className="flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => onDateSelect(date)}
          >
            <div className="text-sm font-medium text-stone-600 dark:text-stone-200">
              {format(date, 'EEE')}
            </div>
            <div className="relative">
              <div
                className={cn(
                  'size-9 rounded-full flex items-center justify-center transition-colors',
                  'select-none',
                  hasActivityForDay && 'bg-primary/40 dark:bg-emerald-900',
                  isTodayDate &&
                    'border-2 border-primary/40 dark:border-primary',
                  isSelected &&
                    'border-2 border-primary dark:border-emerald-600'
                )}
              >
                <span className="text-sm font-medium">{format(date, 'd')}</span>
              </div>
              {activityCount > 1 && (
                <ActivityBadgeNumber count={activityCount} />
              )}

              {mostRecentType && activityCount === 1 && (
                <ActivityBadgeIcon
                  activityType={mostRecentType}
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivitiesWeek;
