import { SWIMMING_STROKES } from '@/constants/swimmingStrokes';
import { cn } from '@/lib/utils';
import { SwimmingStrokeItem } from '@/types/Activity';

const StrokeLine = ({ stroke }: { stroke: SwimmingStrokeItem }) => {
  const sets = stroke.sets || '0';
  const laps = stroke.laps ? stroke.laps : null;
  const duration = stroke.duration || null; // keep duration string as-is

  return (
    <div className="bg-stone-50 rounded-lg p-3 dark:bg-stone-900">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-stone-700 dark:text-stone-300">
          {SWIMMING_STROKES[stroke.name].name}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-stone-700 font-medium dark:text-stone-400 bg-stone-200 dark:bg-stone-800 px-2 py-1.5 rounded max-w-max">
        <div
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-400',
            !laps && !duration ? 'col-span-3' : ''
          )}
        >
          <span className="bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-xs font-medium min-w-[4ch] inline-block text-center whitespace-nowrap">
            {sets} ×
          </span>
        </div>

        {laps && (
          <div className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-400">
            <span className="bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-xs font-medium min-w-[4ch] inline-block text-center whitespace-nowrap">
              {laps} laps
            </span>
          </div>
        )}

        {duration && (
          <div className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-400">
            <span className="bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-xs font-medium min-w-[4ch] inline-block text-center whitespace-nowrap">
              {duration} sec
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrokeLine;
