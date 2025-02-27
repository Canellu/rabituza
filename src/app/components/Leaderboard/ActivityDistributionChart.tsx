'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { ActivityType } from '@/types/Activity';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

interface ActivityDistributionChartProps {
  activities: ActivityType[];
}

const chartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

const ActivityDistributionChart = ({
  activities,
}: ActivityDistributionChartProps) => {
  const activityCounts = activities.reduce((acc, activity) => {
    const type = activity.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalActivities = Object.values(activityCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const chartData = Object.entries(activityCounts).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="flex flex-col items-start gap-2 justify-between">
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-medium">Activity Distribution</span>
      </div>
      <div className="w-full border p-4 rounded-md">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              right: 24,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="type" type="category" hide />
            <XAxis dataKey="count" type="number" hide />

            <Bar
              dataKey="count"
              layout="vertical"
              fill="hsl(var(--chart-6))"
              radius={4}
            >
              <LabelList
                dataKey="type"
                position="insideLeft"
                offset={12}
                className="fill-white font-medium capitalize"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-emerald-800 font-semibold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        <p className="text-sm text-stone-600 mt-2">
          Total: {totalActivities} activities
        </p>
      </div>
    </div>
  );
};

export default ActivityDistributionChart;
