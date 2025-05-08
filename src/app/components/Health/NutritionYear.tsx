'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Meal } from '@/types/Nutrition';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type NutritionYearProps = {
  entries?: Meal[];
};

const chartConfig = {
  calories: {
    label: 'Average Daily Calories',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const NutritionYear = ({ entries = [] }: NutritionYearProps) => {
  const currentYear = new Date().getFullYear();

  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const monthEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.mealDate);
      return (
        entryDate.getMonth() === month &&
        entryDate.getFullYear() === currentYear
      );
    });

    const daysWithEntries = new Set(
      monthEntries.map((entry) => new Date(entry.mealDate).toLocaleDateString())
    ).size;

    const totalCalories = monthEntries.reduce(
      (sum, entry) =>
        sum +
        entry.mealItems.reduce(
          (entrySum: number, mealItem) => entrySum + mealItem.calories,
          0
        ),
      0
    );

    const averageDailyCalories = daysWithEntries
      ? Math.round(totalCalories / daysWithEntries)
      : 0;

    return {
      month: new Date(0, month).toLocaleString('default', { month: 'long' }),
      calories: averageDailyCalories,
    };
  });

  const maxCalories = Math.max(...monthlyData.map((data) => data.calories));
  const yAxisTicks = Array.from(
    { length: Math.ceil(maxCalories / 500) + 1 },
    (_, i) => i * 500
  );

  return (
    <div className="overflow-auto border bg-gradient-to-b from-white to-emerald-50 dark:from-emerald-700 dark:to-emerald-800 rounded-md px-2 pt-10 pb-2">
      <ChartContainer config={chartConfig} className="h-[273px] w-[680px]">
        <BarChart data={monthlyData}>
          <defs>
            <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
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
            width={40}
            ticks={yAxisTicks}
          />
          <Bar
            dataKey="calories"
            fill="url(#caloriesGradient)"
            radius={[4, 4, 0, 0]}
            barSize={35}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default NutritionYear;
