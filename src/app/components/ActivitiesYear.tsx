'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ActivityType } from '@/types/Activity';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

  return (
    <div className="overflow-auto border bg-gradient-to-b from-white to-emerald-50 rounded-md px-2 pt-10 pb-2">
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                color="hsl(var(--chart-6))"
              />
            }
          />
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
  );
};

export default ActivitiesYear;
