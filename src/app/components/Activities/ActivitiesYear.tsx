'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { ActivityType } from '@/types/Activity';
import { CalendarDays, TrendingUp, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import ActivityStatCard from './ActivityStatCard';

type ActivitiesYearProps = {
  activities?: ActivityType[];
};

const chartConfig = {
  activities: {
    label: 'Activities',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const ActivitiesYear = ({ activities = [] }: ActivitiesYearProps) => {
  const currentYear = new Date().getFullYear();

  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const count = activities.filter((activity) => {
      const activityDate = new Date(activity.activityDate);
      return (
        activityDate.getMonth() === month &&
        activityDate.getFullYear() === currentYear
      );
    }).length;

    return {
      month: new Date(0, month).toLocaleString('default', {
        month: 'long',
      }),
      activities: count,
    };
  });

  const maxActivity = Math.max(...monthlyData.map((data) => data.activities));
  const yAxisTicks = Array.from(
    { length: Math.ceil(maxActivity / 2) + 1 },
    (_, i) => i * 2
  );

  const totalActivities = monthlyData.reduce(
    (sum, month) => sum + month.activities,
    0
  );
  const mostActiveMonth = monthlyData.reduce(
    (max, month) => (month.activities > max.activities ? month : max),
    monthlyData[0]
  );
  const activeMonths = monthlyData.filter(
    (month) => month.activities > 0
  ).length;
  const averageActivitiesPerMonth =
    activeMonths > 0 ? totalActivities / activeMonths : 0;

  return (
    <>
      <h2 className="text-xl font-semibold my-4 dark:text-stone-200">
        Activities for {currentYear}
      </h2>
      <div className="overflow-auto border bg-gradient-to-b dark:border-none from-white to-emerald-50 dark:from-emerald-800 dark:to-emerald-950 rounded-md px-2">
        <ChartContainer config={chartConfig} className="h-[273px] w-[680px]">
          <BarChart data={monthlyData}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-6))"
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 8"
              stroke="rgba(0, 0, 0, 0.25)"
            />
            {/* <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                color="hsl(var(--chart-6))"
              />
            }
          /> */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
              height={40}
            />
            <YAxis
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              width={30}
              ticks={yAxisTicks}
            />
            <Bar
              dataKey="activities"
              fill="url(#activityGradient)"
              radius={[4, 4, 0, 0]}
              barSize={35}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <ActivityStatCard
          icon={CalendarDays}
          title="Total Activities"
          value={totalActivities}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBgColor="bg-emerald-100 dark:bg-emerald-900"
        />

        <ActivityStatCard
          icon={Trophy}
          title="Most Active Month"
          value={mostActiveMonth.month.slice(0, 3)}
          subtitle={`${mostActiveMonth.activities} activities`}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900"
        />

        <ActivityStatCard
          icon={TrendingUp}
          title="Average per Month"
          value={averageActivitiesPerMonth.toFixed(1)}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>
    </>
  );
};

export default ActivitiesYear;
