import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { addDays, format, isToday, startOfWeek } from 'date-fns';
import ActivityBadgeIcon from './ActivityBadgeIcon';

type ActivitiesWeekProps = {
  activities?: ActivityType[];
};

const ActivitiesWeek = ({ activities = [] }: ActivitiesWeekProps) => {
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

  return (
    <div className="flex justify-between border p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50">
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const isCurrentDay = isToday(date);
        const hasActivityForDay = hasActivity(date);
        const mostRecentType = getMostRecentActivityType(date);

        return (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="text-sm font-medium text-stone-600">
              {format(date, 'EEE')}
            </div>
            <div className="relative">
              <div
                className={cn(
                  'size-9 rounded-full flex items-center justify-center',
                  hasActivityForDay && 'bg-primary/50 font-semibold',
                  isCurrentDay && 'border-2 border-primary/50'
                )}
              >
                <span className="text-sm font-medium">{format(date, 'd')}</span>
              </div>
              {mostRecentType && (
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
