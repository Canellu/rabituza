import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { format, isToday } from 'date-fns';
import ActivityBadgeIcon from './ActivityBadgeIcon';
import ActivityBadgeNumber from './ActivityBadgeNumber';

type ActivitiesMonthProps = {
  activities?: ActivityType[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
};

const ActivitiesMonth = ({
  activities = [],
  onDateSelect,
  selectedDate,
}: ActivitiesMonthProps) => {
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

  const getActivityCount = (date: Date) => {
    return activities.filter(
      (activity) =>
        new Date(activity.activityDate).toLocaleDateString() ===
        date.toLocaleDateString()
    ).length;
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      className="rounded-md border w-full flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 py-5"
      showOutsideDays={false}
      weekStartsOn={1}
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
          const activityCount = getActivityCount(date);
          const isSelected =
            date.toLocaleDateString() === selectedDate.toLocaleDateString();

          if (isOutsideDay) return null;

          return (
            <div
              className="relative cursor-pointer"
              onClick={() => onDateSelect(date)}
            >
              <div
                className={cn(
                  'flex items-center justify-center size-9 rounded-full transition-colors',
                  'select-none duration-500',
                  hasActivityForDay && 'bg-primary/40',
                  isTodayDate && 'border-2 border-primary/40',
                  isSelected && 'border-2 border-primary'
                )}
              >
                {format(date, 'd')}
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
          );
        },
      }}
    />
  );
};

export default ActivitiesMonth;
