import { cn } from '@/lib/utils';
import { NutritionEntry } from '@/types/Nutrition';
import { addDays, format, isToday, startOfWeek } from 'date-fns';

type NutritionWeekProps = {
  entries?: NutritionEntry[];
};

const NutritionWeek = ({ entries = [] }: NutritionWeekProps) => {
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
        (foodSum, food) => foodSum + (food.calories || 0),
        0
      );
      const drinkCalories = entry.drinks.reduce(
        (drinkSum, drink) => drinkSum + (drink.calories || 0),
        0
      );
      return sum + foodCalories + drinkCalories;
    }, 0);
  };

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  return (
    <div className="flex justify-between border p-4 rounded-md bg-gradient-to-b from-white to-emerald-50">
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        const isCurrentDay = isToday(date);
        const hasEntryForDay = hasEntry(date);
        const calories = getDailyCalories(date);

        return (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="text-sm font-medium text-stone-600">
              {format(date, 'EEE')}
            </div>
            <div className="relative">
              <div
                className={cn(
                  'size-9 rounded-full flex items-center justify-center',
                  hasEntryForDay && 'bg-primary/50 font-semibold',
                  isCurrentDay && 'border-2 border-primary/50'
                )}
              >
                <span className="text-sm font-medium">{format(date, 'd')}</span>
              </div>
              {calories > 0 && (
                <div className="absolute -bottom-6 text-xs font-medium text-stone-600">
                  {calories} kcal
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionWeek;
