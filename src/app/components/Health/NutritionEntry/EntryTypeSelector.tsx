'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MealEntryType } from '@/types/Nutrition';

interface EntryTypeSelectorProps {
  selectedEntryType: MealEntryType;
  onEntryTypeChange: (value: MealEntryType) => void;
}

const EntryTypeSelector = ({
  selectedEntryType,
  onEntryTypeChange,
}: EntryTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Entry Type</label>
      <ToggleGroup
        type="single"
        value={selectedEntryType}
        onValueChange={(value) => {
          if (value) onEntryTypeChange(value as MealEntryType); // Prevent deselection
        }}
        className="grid grid-cols-2 bg-stone-50 border rounded-md p-1"
      >
        <ToggleGroupItem
          value="food"
          className="data-[state=on]:bg-stone-200 capitalize px-2 py-1 min-h-max h-8"
        >
          Food
        </ToggleGroupItem>
        <ToggleGroupItem
          value="drink"
          className="data-[state=on]:bg-stone-200 capitalize px-2 py-1 min-h-max h-8"
        >
          Drink
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default EntryTypeSelector;
