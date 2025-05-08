import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Meal, NutritionTarget } from '@/types/Nutrition';
import { format, isToday } from 'date-fns';

type NutritionMonthProps = {
  meals?: Meal[];
  target?: NutritionTarget;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
};

const NutritionMonth = ({
  meals = [],
  target,
  onDateSelect,
  selectedDate,
}: NutritionMonthProps) => {
  const currentYear = new Date().getFullYear();

  const hasEntry = (date: Date) =>
    meals.some(
      (entry) =>
        new Date(entry.mealDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

  const totalCaloriesForDay = (date: Date) =>
    meals
      .filter(
        (meal) =>
          new Date(meal.mealDate).toLocaleDateString() ===
          date.toLocaleDateString()
      )
      .reduce((total, meal) => {
        const mealCalories = meal.mealItems.reduce(
          (itemTotal, item) => itemTotal + item.calories,
          0
        );
        return total + mealCalories;
      }, 0);

  const isTargetDay = (date: Date) => {
    if (!target) return false;
    const dayOfWeek = date.getDay();
    return (
      date >= target.startDate &&
      date <= target.endDate &&
      target.daysOfWeek.includes(dayOfWeek)
    );
  };

  return (
    <Calendar
      mode="single"
      className="rounded-xl border w-full flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 dark:from-emerald-900 dark:to-emerald-950 py-5 dark:border-transparent"
      showOutsideDays={false}
      weekStartsOn={1}
      fromDate={new Date(currentYear, 0, 1)}
      toDate={new Date(currentYear, 11, 31)}
      classNames={{
        head_row: 'flex space-x-2.5 text-sm',
        row: 'flex w-full mb-4 space-x-2.5',
        day: 'size-9 rounded-full relative',
        cell: 'size-9 text-center text-sm p-0 relative',
        head_cell:
          'size-9 font-normal flex items-center justify-center text-stone-500 dark:text-stone-200',
        day_today: 'border-2 border-primary/50',
      }}
      components={{
        Day: ({ date, displayMonth }) => {
          const isOutsideDay = displayMonth.getMonth() !== date.getMonth();
          const hasMealForDay = hasEntry(date);
          const isTodayDate = isToday(date);
          const isTargetDayDate = isTargetDay(date);
          const totalCalories = totalCaloriesForDay(date);
          const exceedsTargetCalories =
            target && totalCalories > target.calories;
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
                  isTargetDayDate &&
                    !hasMealForDay &&
                    'border-2 border-stone-200 dark:bg-emerald-900 dark:border-transparent',
                  isTargetDayDate &&
                    hasMealForDay &&
                    exceedsTargetCalories &&
                    'bg-orange-300 dark:bg-emerald-600',
                  isTargetDayDate &&
                    hasMealForDay &&
                    !exceedsTargetCalories &&
                    'bg-primary/50 dark:bg-emerald-600',
                  isTodayDate &&
                    'border-2 border-primary/40 dark:border-primary',
                  isSelected &&
                    'border-2 border-primary dark:border-emerald-600'
                )}
              >
                {format(date, 'd')}
              </div>
            </div>
          );
        },
      }}
    />
  );
};

export default NutritionMonth;
