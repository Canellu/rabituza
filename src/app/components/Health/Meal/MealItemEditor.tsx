import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MealItem } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MealManualForm from './MealManualForm';
import MealSearchForm from './MealSearchForm';

interface MealItemEditor {
  mealItem: MealItem;
  onUpdateMealItem: (mealItem: MealItem) => void;
  onRemoveMealItem: () => void;
}

const InputModes = {
  MANUAL: 'manual',
  SEARCH: 'search',
} as const;
export type InputMode = (typeof InputModes)[keyof typeof InputModes];

const MealItemEditor = ({
  mealItem,
  onUpdateMealItem: onUpdateMealEntry,
  onRemoveMealItem: onRemoveMealEntry,
}: MealItemEditor) => {
  const [itemName, setItemName] = useState(mealItem.name);
  const [inputMode, setInputMode] = useState<InputMode>(InputModes.MANUAL);

  return (
    <div className="border bg-white p-4 pt-2 rounded-md relative flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <div
          className={cn(
            'text-sm font-medium',
            !itemName && 'text-stone-500 font-normal'
          )}
        >
          {itemName || 'Food/Drink'}
        </div>
        {/* X button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemoveMealEntry}
          className="translate-x-2"
        >
          <X />
        </Button>
      </div>

      {/* Input Mode selector */}
      <div className="space-y-1">
        <Label className="text-sm">Input mode</Label>
        <ToggleGroup
          type="single"
          value={inputMode}
          onValueChange={(value) => {
            if (value) {
              setInputMode(value as InputMode);
            }
          }}
          className="grid grid-cols-2 bg-stone-50 border rounded-md p-1 grow"
        >
          <ToggleGroupItem
            value={InputModes.MANUAL}
            className="data-[state=on]:bg-stone-200 capitalize min-h-max h-8"
          >
            Manual
          </ToggleGroupItem>
          <ToggleGroupItem
            value={InputModes.SEARCH}
            className="data-[state=on]:bg-stone-200 capitalize min-h-max h-8"
          >
            Search
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Manual Input */}
      {inputMode === InputModes.MANUAL && (
        <MealManualForm
          itemName={itemName}
          setItemName={setItemName}
          onUpdateMealItem={onUpdateMealEntry}
        />
      )}

      <div className="flex items-center">
        {inputMode === InputModes.SEARCH && (
          <MealSearchForm
            itemName={itemName}
            setItemName={setItemName}
            mealItem={mealItem}
            onUpdateMealItem={onUpdateMealEntry}
          />
        )}
      </div>
    </div>
  );
};

export default MealItemEditor;
