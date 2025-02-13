import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { motion } from 'framer-motion';

interface NutritionDayPickerProps {
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
}

const NutritionDayPicker = ({
  selectedDay,
  setSelectedDay,
}: NutritionDayPickerProps) => {
  const today = new Date();
  const weekStart = addDays(today, -3);

  return (
    <div className="grid grid-cols-7 items-center justify-between gap-1 relative">
      {Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(weekStart, i);
        const isSelected =
          format(date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd');
        const isToday =
          format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

        return (
          <div
            key={i}
            className={cn(
              'relative rounded-full px-3 py-1.5 text-sm font-medium',
              'text-stone-600 flex flex-col items-center justify-center',
              'transition-all duration-200 ease'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
            onClick={() => setSelectedDay(date)}
          >
            {isSelected && (
              <motion.span
                layoutId="bubble"
                className="absolute -inset-1 -z-10 bg-white border rounded-lg"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            )}
            <span
              className={cn(
                'text-xs',
                isSelected ? 'font-semibold text-emerald-800' : ''
              )}
            >
              {isToday ? 'Today' : format(date, 'EEEEEE')}
            </span>
            <span
              className={cn(
                'text-sm transition-colors duration-200 ease-in-out',
                isSelected ? 'font-semibold text-base text-emerald-800' : ''
              )}
            >
              {format(date, 'd')}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionDayPicker;
