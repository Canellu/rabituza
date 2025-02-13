'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MealEntryType, MealEntryTypes } from '@/types/Nutrition';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface EntryTypeSelectorProps {
  onAddEntryType: (entryType: MealEntryType) => void; // Pass entryType to the function
}

const EntryTypeSelector = ({ onAddEntryType }: EntryTypeSelectorProps) => {
  const [entryType, setEntryType] = useState<MealEntryType>(
    MealEntryTypes.Food
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm">Entry Type</Label>
      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={entryType}
          onValueChange={(value) => {
            if (value) setEntryType(value as MealEntryType); // Prevent deselection
          }}
          className="grid grid-cols-2 bg-stone-50 border rounded-md p-1 grow"
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
        <Button
          variant="default"
          size="icon"
          onClick={() => onAddEntryType(entryType)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EntryTypeSelector;
