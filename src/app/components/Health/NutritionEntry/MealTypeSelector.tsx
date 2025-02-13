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
        onValueChange={(value) => onMealTypeChange(value as MealType)}
        className="grid grid-cols-4 bg-stone-50 border rounded-md p-1"
      >
        {Object.entries(MealTypes).map(([key, value]) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="data-[state=on]:bg-stone-200 capitalize px-2 py-1"
          >
            {key}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default MealTypeSelector;
