import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { activityLevels } from '@/lib/utils/nutrition';

interface ActivityLevelSelectorProps {
  selectedActivity: keyof typeof activityLevels | undefined;
  onActivityChange: (value: keyof typeof activityLevels) => void;
}

const ActivityLevelSelector = ({
  selectedActivity,
  onActivityChange,
}: ActivityLevelSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm">Activity Level</Label>
      <ToggleGroup
        type="single"
        value={selectedActivity}
        onValueChange={(value) =>
          value && onActivityChange(value as keyof typeof activityLevels)
        }
        className="flex justify-between bg-stone-50 border rounded-md p-1"
      >
        {(
          Object.keys(activityLevels) as Array<keyof typeof activityLevels>
        ).map((level) => (
          <ToggleGroupItem
            key={level}
            value={level}
            className="data-[state=on]:bg-stone-200 capitalize px-2 h-8"
          >
            {activityLevels[level].shortName}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default ActivityLevelSelector;
