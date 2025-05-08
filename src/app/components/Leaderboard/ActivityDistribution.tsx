'use client';

import { getActivityIcon } from '@/lib/utils/getActivityIcon';
import { ActivityType, ActivityTypes } from '@/types/Activity';
import { CalendarDays, Crown, Layout, Trophy } from 'lucide-react';
import ActivityStatCard from '../Activities/ActivityStatCard';

interface ActivityDistributionProps {
  activities: ActivityType[];
}

const ActivityDistribution = ({ activities }: ActivityDistributionProps) => {
  // Calculate total activities
  const totalActivities = activities.length;

  // Count activities by type
  const activityCounts = Object.values(ActivityTypes).reduce((acc, type) => {
    acc[type] = activities.filter((activity) => activity.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter out activity types with zero count
  const activeActivityTypes = Object.entries(activityCounts).filter(
    ([_, count]) => count > 0
  );

  // Calculate activity diversity (number of different activity types used)
  const activityDiversity = Object.values(activityCounts).filter(
    (count) => count > 0
  ).length;

  // Calculate most active day
  const dayCount = activities.reduce((acc, activity) => {
    const day = new Date(activity.activityDate).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const mostActiveDay = Object.entries(dayCount).reduce(
    (max, [day, count]) => (count > (dayCount[max] || 0) ? Number(day) : max),
    0
  );

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Find most active type
  const mostActiveType = Object.entries(activityCounts).reduce(
    (max, [type, count]) => (count > max.count ? { type, count } : max),
    { type: '', count: 0 }
  );

  return (
    <div className="flex flex-col items-start gap-4 justify-between">
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-medium">Activity Distribution</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
        <ActivityStatCard
          icon={CalendarDays}
          title="Total Activities"
          value={totalActivities}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900"
          compact
        />
        <ActivityStatCard
          icon={Crown}
          title="Most Active Type"
          value={
            mostActiveType.type.charAt(0).toUpperCase() +
            mostActiveType.type.slice(1).replace('_', ' ')
          }
          subtitle={`${mostActiveType.count} activities`}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBgColor="bg-yellow-100 dark:bg-yellow-900"
          compact
        />
        <ActivityStatCard
          icon={Trophy}
          title="Most Active Day"
          value={dayNames[mostActiveDay].slice(0, 3)}
          subtitle={`${dayCount[mostActiveDay]} activities`}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900"
          compact
        />
        <ActivityStatCard
          icon={Layout}
          title="Activity Types"
          value={activityDiversity}
          subtitle="different activities"
          iconColor="text-orange-600 dark:text-orange-400"
          iconBgColor="bg-orange-100 dark:bg-orange-900"
          compact
        />
      </div>

      <div className="flex items-center w-full gap-3 mt-2">
        <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
          Activity Breakdown
        </span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
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

export default ActivityDistribution;
