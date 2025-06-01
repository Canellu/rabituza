'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SWIMMING_STROKES } from '@/constants/swimmingStrokes';
import { SwimmingStrokeItem } from '@/types/Activity';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SelectedStrokesListProps {
  strokes: SwimmingStrokeItem[];
  setStrokes: Dispatch<SetStateAction<SwimmingStrokeItem[]>>;
}

const SelectedStrokesList = ({
  strokes,
  setStrokes,
}: SelectedStrokesListProps) => {
  const updateStroke = (
    index: number,
    field: keyof SwimmingStrokeItem,
    value: string
  ) => {
    setStrokes((prev) =>
      prev.map((stroke, i) =>
        i === index ? { ...stroke, [field]: value } : stroke
      )
    );
  };

  const removeStroke = (index: number) => {
    setStrokes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 space-y-2">
      {strokes.map((stroke, index) => {
        const strokeMeta = SWIMMING_STROKES[stroke.name];
        const isDrill = strokeMeta.category === 'Drill';

        return (
          <div
            key={index}
            className="border rounded-md p-4 space-y-3 relative  dark:bg-stone-800 dark:border-stone-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium dark:text-white">
                  {strokeMeta.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {strokeMeta.category}
                  {'difficulty' in strokeMeta
                    ? ` • ${strokeMeta.difficulty}`
                    : ''}
                  {'focus' in strokeMeta && strokeMeta.focus?.length
                    ? ` • ${strokeMeta.focus.join(', ')}`
                    : ''}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeStroke(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Separator className="dark:bg-stone-700" />

            <div className="flex gap-4">
              <div className="flex gap-1.5 items-center justify-center">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
                  Sets
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={stroke.sets}
                  onChange={(e) => updateStroke(index, 'sets', e.target.value)}
                  maxLength={2}
                  onFocus={() => updateStroke(index, 'sets', '')}
                  className="w-10 h-8 px-1.5"
                  placeholder="0"
                />
              </div>

              {isDrill ? (
                <div className="flex gap-1.5 items-center justify-end">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
                    Duration
                  </span>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={stroke.duration ?? ''}
                      onChange={(e) =>
                        updateStroke(index, 'duration', e.target.value)
                      }
                      onFocus={() => updateStroke(index, 'duration', '')}
                      maxLength={3}
                      className="w-[72px] h-8 px-1.5 pr-9"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                      sec
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
                    Laps
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={stroke.laps ?? ''}
                    maxLength={2}
                    onChange={(e) =>
                      updateStroke(index, 'laps', e.target.value)
                    }
                    onFocus={() => updateStroke(index, 'laps', '')}
                    className="w-12 h-8 px-1.5"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedStrokesList;
