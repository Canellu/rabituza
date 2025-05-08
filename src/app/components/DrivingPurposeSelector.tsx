import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DrivingPurpose, DrivingPurposes } from '@/types/Activity';

interface DrivingPurposeSelectorProps {
  purpose: DrivingPurpose;
  onPurposeChange: (newPurpose: DrivingPurpose) => void;
}

const DrivingPurposeSelector = ({
  purpose,
  onPurposeChange,
}: DrivingPurposeSelectorProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Purpose</label>
      <ToggleGroup
        type="single"
        value={purpose}
        onValueChange={(value) => {
          if (value) onPurposeChange(value as DrivingPurpose);
        }}
        className="grid grid-cols-2 bg-stone-50 border rounded-md p-1 dark:bg-stone-800 dark:border-transparent"
      >
        <ToggleGroupItem
          value={DrivingPurposes.lesson}
          className="data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-700 capitalize px-2 py-1 h-8"
        >
          Lesson
        </ToggleGroupItem>
        <ToggleGroupItem
          value={DrivingPurposes.leisure}
          className="data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-700 capitalize px-2 py-1 h-8"
        >
          Leisure
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DrivingPurposeSelector;
