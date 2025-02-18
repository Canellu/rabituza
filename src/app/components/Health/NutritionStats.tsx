'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { calculateMealsTotals } from '@/lib/utils/nutrition';
import { Meal, NutritionTarget } from '@/types/Nutrition';
import { easeInOut, motion } from 'framer-motion';
import AnimatedValue from '../AnimatedValue';
import Spinner from '../Spinner';

interface NutritionStatsProps {
  meals: Meal[];
  isLoading: boolean;
  nutritionTarget: NutritionTarget | null;
  isInTargetPeriod: boolean;
  selectedDay: Date; // Add this prop
}

const NutritionStats = ({
  meals,
  isLoading,
  nutritionTarget,
  isInTargetPeriod,
  selectedDay,
}: NutritionStatsProps) => {
  const isTargetDay =
    isInTargetPeriod &&
    nutritionTarget?.daysOfWeek.includes(selectedDay.getDay());

  // Filter meals for the selected day
  const mealsForSelectedDay = meals.filter(
    (meal) => meal.mealDate.toDateString() === selectedDay.toDateString()
  );

  // Calculate total nutritional values for the selected day using calculateMealsTotals
  const totalNutrients = calculateMealsTotals(mealsForSelectedDay);

  // Calculate remaining calories by subtracting total meal calories from target calories
  const remainingCalories =
    isTargetDay && nutritionTarget
      ? nutritionTarget.calories - totalNutrients.calories
      : '-';

  const remainingCaloriesValue =
    typeof remainingCalories === 'number' ? remainingCalories : 0;
  const isOvereaten = remainingCaloriesValue < 0;
  const todaysCalories = isOvereaten
    ? `${Math.abs(remainingCaloriesValue)}`
    : remainingCaloriesValue;

  if (isLoading) {
    return (
      <div className="h-[174px] flex items-center flex-col gap-3 justify-center animate-pulse">
        <Spinner size="size-12" color="text-emerald-800" />
        <span className="text-emerald-800 font-medium">
          Loading nutrition target...
        </span>
      </div>
    );
  }

  if (!nutritionTarget) {
    return (
      <div className="text-emerald-800 text-center text-sm">No target set</div>
    );
  }

  const nutrients = [
    { label: 'Carbs', value: totalNutrients.carbs },
    { label: 'Protein', value: totalNutrients.protein },
    { label: 'Fat', value: totalNutrients.fat },
    { label: 'Fiber', value: totalNutrients.fiber },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex flex-col gap-6 items-center justify-center"
    >
      <div className="flex">
        <div className="text-center flex flex-col">
          <span
            className={cn(
              'text-7xl font-semibold text-center ',
              'transition-colors duration-200 ease-in-out',
              isOvereaten ? 'text-yellow-600' : 'text-emerald-800'
            )}
          >
            <AnimatedValue value={todaysCalories} />
          </span>
          <span
            className={cn(
              'text-sm',
              'transition-colors duration-200 ease-in-out',
              isOvereaten ? 'text-yellow-700' : 'text-emerald-900'
            )}
          >
            {isOvereaten ? 'calories exceeding target' : 'remaining calories'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full text-stone-700">
        {nutrients.map((nutrient) => {
          const targetValue =
            nutritionTarget[
              nutrient.label.toLowerCase() as keyof Pick<
                NutritionTarget,
                'carbs' | 'protein' | 'fat' | 'fiber'
              >
            ];
          const percentage = targetValue
            ? Math.min((nutrient.value / targetValue) * 100, 100)
            : 0;

          // Determine if the nutrient value is exceeding or below the target
          const isExceeding =
            nutrient.label === 'Carbs' || nutrient.label === 'Fat'
              ? nutrient.value > targetValue
              : nutrient.value < targetValue;

          return (
            <div
              key={nutrient.label}
              className={cn(
                'flex flex-col gap-1 items-center text-center',
                'border rounded-lg py-2 px-2',
                'bg-secondary'
              )}
            >
              <span className={cn('text-xs font-medium')}>
                {nutrient.label}
              </span>
              <div className={cn('font-medium text-xs')}>
                <AnimatedValue value={nutrient.value} /> /{' '}
                <span>{String(targetValue)}</span>
              </div>
              <Progress
                value={percentage}
                className={cn('w-full h-2 border')}
                classNameIndicator={cn(
                  isExceeding ? 'bg-orange-500' : 'bg-emerald-600'
                )}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NutritionStats;
