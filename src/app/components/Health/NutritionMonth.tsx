import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { NutritionEntry, NutritionTarget } from '@/types/Nutrition';
import { format, isToday } from 'date-fns';

type NutritionMonthProps = {
  entries?: NutritionEntry[];
  target?: NutritionTarget;
};

const NutritionMonth = ({ entries = [], target }: NutritionMonthProps) => {
  const currentYear = new Date().getFullYear();

  const hasEntry = (date: Date) =>
    entries.some(
      (entry) =>
        new Date(entry.mealDate).toLocaleDateString() ===
        date.toLocaleDateString()
    );

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
      className="rounded-xl border w-full flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 py-5"
      showOutsideDays={false}
      fromDate={new Date(currentYear, 0, 1)}
      toDate={new Date(currentYear, 11, 31)}
      classNames={{
        head_row: 'flex space-x-2.5 text-sm',
        row: 'flex w-full mb-4 space-x-2.5',
        day: 'size-9 rounded-full relative',
        cell: 'size-9 text-center text-sm p-0 relative',
        head_cell:
          'size-9 font-normal flex items-center justify-center text-stone-500',
        day_today: 'border-2 border-primary/50',
      }}
      components={{
        Day: ({ date, displayMonth }) => {
          const isOutsideDay = displayMonth.getMonth() !== date.getMonth();
          const hasEntryForDay = hasEntry(date);
          const isTodayDate = isToday(date);
          const isTargetDayDate = isTargetDay(date);

          if (isOutsideDay) return null;

          return (
            <div className="relative">
              <div
                className={cn(
                  'flex items-center justify-center size-9 rounded-full',
                  hasEntryForDay && 'bg-stone-50 font-semibold',
                  isTargetDayDate && 'border-2 border-stone-200 font-semibold',
                  isTodayDate && 'border-2 border-primary/50'
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
