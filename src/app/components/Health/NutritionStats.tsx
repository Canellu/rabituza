'use client';

import { Progress } from '@/components/ui/progress';
import ScrollShadow from '@/components/ui/ScrollShadow';
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
    typeof remainingCalories === 'number' ? remainingCalories : '-';
  const isOvereaten =
    typeof remainingCaloriesValue === 'number' && remainingCaloriesValue < 0;
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
    { label: 'Protein', value: totalNutrients.protein },
    { label: 'Fiber', value: totalNutrients.fiber },
    { label: 'Carbs', value: totalNutrients.carbs },
    { label: 'Fat', value: totalNutrients.fat },
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
              isOvereaten
                ? 'text-orange-500'
                : 'text-emerald-800 dark:text-emerald-700'
            )}
          >
            <AnimatedValue value={todaysCalories} />
          </span>
          <span
            className={cn(
              'text-sm',
              'transition-colors duration-200 ease-in-out',
              isOvereaten
                ? 'text-orange-600'
                : 'text-emerald-900 dark:text-emerald-800'
            )}
          >
            {isOvereaten ? 'calories exceeding target' : 'remaining calories'}
          </span>
        </div>
      </div>

      <ScrollShadow orientation="horizontal" className="w-full" hideScrollBar>
        <div className={cn('flex gap-2 w-full text-stone-700')}>
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
                  'flex flex-col gap-1 items-start',
                  'px-4 py-3 min-w-32',
                  'border bg-white rounded-xl dark:border-transparent dark:bg-stone-800',
                  'text-xs font-semibold dark:text-stone-200'
                )}
              >
                <p>{nutrient.label}</p>
                <div className="text-stone-800 dark:text-stone-300 space-x-px mb-1">
                  <AnimatedValue value={isTargetDay ? nutrient.value : '-'} />
                  <span>/</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {isTargetDay ? `${String(targetValue)}g` : '-'}
                  </span>
                </div>

                <Progress
                  value={percentage}
                  className={cn('w-full h-2')}
                  classNameIndicator={cn(
                    'bg-gradient-to-r rounded-r-full',
                    isExceeding
                      ? 'from-orange-600 to-orange-300'
                      : 'from-emerald-700 to-emerald-300'
                  )}
                />
              </div>
            );
          })}
        </div>
      </ScrollShadow>
    </motion.div>
  );
};

export default NutritionStats;
