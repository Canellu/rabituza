'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MealType, MealTypes } from '@/types/Nutrition';

interface MealTypeSelectorProps {
  selectedMealType: MealType;
  onMealTypeChange: (value: MealType) => void;
}

const MealTypeSelector = ({
  selectedMealType,
  onMealTypeChange,
}: MealTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Meal Type</label>
      <ToggleGroup
        type="single"
        value={selectedMealType}
        onValueChange={(value) => {
          if (value) onMealTypeChange(value as MealType); // Prevent deselection
        }}
        className="grid grid-cols-4 bg-stone-50 border rounded-md p-1 dark:bg-stone-800 dark:border-transparent"
      >
        {Object.entries(MealTypes).map(([key, value]) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-700 capitalize px-2 py-1 h-8"
          >
            {key}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default MealTypeSelector;
