import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getActivityIcon } from '@/lib/utils/getActivityIcon';
import { ActivityType, ActivityTypes } from '@/types/Activity';
import { format, isToday } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import ActivityBadgeIcon from './ActivityBadgeIcon';
import ActivityBadgeNumber from './ActivityBadgeNumber';
import ActivityStatCard from './ActivityStatCard';

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
  const [selectedMonth, setSelectedMonth] = useState(
    format(selectedDate, 'MMMM yyyy')
  );
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

  // Calculate activities for selected month
  const selectedMonthActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.activityDate);
    const [month, year] = selectedMonth.split(' ');
    return (
      format(activityDate, 'MMMM') === month &&
      activityDate.getFullYear() === parseInt(year)
    );
  });

  // Count activities by type for selected month
  const activityCounts = Object.values(ActivityTypes).reduce((acc, type) => {
    acc[type] = selectedMonthActivities.filter(
      (activity) => activity.type === type
    ).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter out activity types with zero count
  const activeActivityTypes = Object.entries(activityCounts).filter(
    ([_, count]) => count > 0
  );

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        onMonthChange={(date) => setSelectedMonth(format(date, 'MMMM yyyy'))}
        className="rounded-md border dark:border-transparent w-full flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-950 py-5"
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
                    'flex items-center justify-center size-9 rounded-full transition-colors dark:text-stone-200',
                    'select-none duration-500',
                    hasActivityForDay && 'bg-primary/40 dark:bg-emerald-900',
                    isTodayDate &&
                      'border-2 border-primary/40 dark:border-primary',
                    isSelected &&
                      'border-2 border-primary dark:border-emerald-600'
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <ActivityStatCard
          icon={CalendarDays}
          title="Month Total"
          value={selectedMonthActivities.length}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900"
          compact
        />
        {activeActivityTypes.map(([type, count]) => {
          const Icon = getActivityIcon(type);
          return Icon ? (
            <ActivityStatCard
              key={type}
              icon={Icon}
              title={
                type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
              }
              value={count}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBgColor="bg-emerald-100 dark:bg-emerald-900"
              compact
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default ActivitiesMonth;
