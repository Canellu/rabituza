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
              isSelected ? '' : 'text-stone-700',
              'relative py-3 flex flex-col gap-2 rounded-2xl items-center justify-center isolate'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
            onClick={() => setSelectedDay(date)}
          >
            <span
              className={cn(
                'text-xs',
                isSelected ? 'font-bold text-stone-50' : ''
              )}
            >
              {isToday ? 'Today' : format(date, 'EEEEEE')}
            </span>
            <span
              className={cn(
                'text-sm transition-colors duration-200 ease-in-out',
                isSelected ? 'font-bold text-base text-stone-50' : ''
              )}
            >
              {format(date, 'd')}
            </span>
            {isSelected && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-y-0 -inset-x-1 -z-10 bg-gradient-to-b border border-white/5 from-white/30 to-transparent backdrop-blur-sm mix-blend-difference rounded-2xl"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.4,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NutritionDayPicker;
