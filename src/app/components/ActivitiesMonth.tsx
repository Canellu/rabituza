import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { format, isToday } from 'date-fns';
import ActivityBadgeIcon from './ActivityBadgeIcon';

type ActivitiesMonthProps = {
  activities?: ActivityType[];
};

const ActivitiesMonth = ({ activities = [] }: ActivitiesMonthProps) => {
  const currentYear = new Date().getFullYear();

  const hasActivity = (date: Date) =>
    activities.some(
      (activity) =>
        new Date(activity.activityDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

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
          const isOutsideDay = displayMonth.getMonth() !== date.getMonth();
          const hasActivityForDay = hasActivity(date);
          const isTodayDate = isToday(date);
          const mostRecentType = getMostRecentActivityType(date);

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
              {mostRecentType && (
                <ActivityBadgeIcon
                  activityType={mostRecentType}
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>
          );
        },
      }}
    />
  );
};

export default ActivitiesMonth;
