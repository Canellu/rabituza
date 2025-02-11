import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { nutritionalGoals } from '@/lib/utils/nutrition';

interface NutritionalGoalSelectorProps {
  selectedGoal: keyof typeof nutritionalGoals | undefined;
  onGoalChange: (value: keyof typeof nutritionalGoals) => void;
}

const NutritionalGoalSelector = ({
  selectedGoal,
  onGoalChange,
}: NutritionalGoalSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Nutritional Goal</Label>
      <ToggleGroup
        type="single"
        value={selectedGoal}
        onValueChange={(value) =>
          value && onGoalChange(value as keyof typeof nutritionalGoals)
        }
        className="flex justify-between bg-stone-50 border rounded-md p-1"
      >
        {(
          Object.keys(nutritionalGoals) as Array<keyof typeof nutritionalGoals>
        ).map((goal) => (
          <ToggleGroupItem
            key={goal}
            value={goal}
            className="data-[state=on]:bg-stone-200 capitalize px-2 py-1 min-h-max"
          >
            {nutritionalGoals[goal].displayName}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default NutritionalGoalSelector;
