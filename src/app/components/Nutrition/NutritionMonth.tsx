import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { NutritionEntry } from '@/types/Nutrition';
import { format, isToday } from 'date-fns';

type NutritionMonthProps = {
  entries?: NutritionEntry[];
};

const NutritionMonth = ({ entries = [] }: NutritionMonthProps) => {
  const currentYear = new Date().getFullYear();

  const hasEntry = (date: Date) =>
    entries.some(
      (entry) =>
        new Date(entry.mealDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

  const getDailyCalories = (date: Date) => {
    const dayEntries = entries.filter(
      (entry) =>
        new Date(entry.mealDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

    return dayEntries.reduce((sum, entry) => {
      const foodCalories = entry.foods.reduce(
        (acc, food) => acc + food.calories,
        0
      );
      const drinkCalories = entry.drinks.reduce(
        (acc, drink) => acc + drink.calories,
        0
      );
      return sum + foodCalories + drinkCalories;
    }, 0);
  };

  return (
    <Calendar
      mode="single"
      className="rounded-md border w-full flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 py-5"
      showOutsideDays={false}
      fromDate={new Date(currentYear, 0, 1)}
      toDate={new Date(currentYear, 11, 31)}
      classNames={{
        head_row: 'flex space-x-1.5',
        row: 'flex w-full mt-2 space-x-1.5',
        day: 'size-9 rounded-full relative',
        cell: 'size-9 text-center text-sm p-0 relative',
        day_today: 'border-2 border-primary/50',
      }}
      modifiers={{ hasEntry }}
      modifiersClassNames={{
        hasEntry: cn('bg-primary/50 font-semibold'),
      }}
      components={{
        Day: ({ date, displayMonth }) => {
          const isOutsideDay = displayMonth.getMonth() !== date.getMonth();
          const hasEntryForDay = hasEntry(date);
          const isTodayDate = isToday(date);
          const calories = getDailyCalories(date);

          if (isOutsideDay) return null;

          return (
            <div className="relative">
              <div
                className={cn(
                  'flex items-center justify-center size-9 rounded-full',
                  hasEntryForDay && 'bg-primary/50 font-semibold',
                  isTodayDate && 'border-2 border-primary/50'
                )}
              >
                {format(date, 'd')}
              </div>
              {calories > 0 && (
                <div className="absolute -bottom-5 text-[10px] font-medium text-stone-600">
                  {calories}
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
};

export default NutritionMonth;
