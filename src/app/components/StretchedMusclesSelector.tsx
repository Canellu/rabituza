import { Checkbox } from '@/components/ui/checkbox';
import {
  LOWER_BODY_STRETCHES,
  SPLITS_AND_PANCAKE_STRETCHES,
  UPPER_BODY_STRETCHES,
} from '@/constants/stretches';

interface StretchedMusclesSelectorProps {
  selectedStretches: string[];
  onStretchChange: (stretches: string[]) => void; // Updated to handle array
}

const StretchedMusclesSelector = ({
  selectedStretches,
  onStretchChange,
}: StretchedMusclesSelectorProps) => {
  const handleStretchToggle = (stretch: string) => {
    onStretchChange(
      selectedStretches.includes(stretch)
        ? selectedStretches.filter((s) => s !== stretch)
        : [...selectedStretches, stretch]
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-stone-50 border rounded-md">
      <StretchGroup
        title="Upper Body"
        stretches={UPPER_BODY_STRETCHES}
        selectedStretches={selectedStretches}
        onStretchChange={handleStretchToggle}
      />
      <StretchGroup
        title="Lower Body"
        stretches={LOWER_BODY_STRETCHES}
        selectedStretches={selectedStretches}
        onStretchChange={handleStretchToggle}
      />
      <StretchGroup
        title="Comprehensive Stretches"
        stretches={SPLITS_AND_PANCAKE_STRETCHES}
        selectedStretches={selectedStretches}
        onStretchChange={handleStretchToggle}
      />
    </div>
  );
};

interface StretchGroupProps {
  title: string;
  stretches: string[];
  selectedStretches: string[];
  onStretchChange: (stretch: string) => void;
}

const StretchGroup = ({
  title,
  stretches,
  selectedStretches,
  onStretchChange,
}: StretchGroupProps) => (
  <div>
    <h3 className="font-medium text-stone-700 mb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {stretches.map((stretch) => (
        <div key={stretch} className="flex items-center gap-2">
          <Checkbox
            checked={selectedStretches.includes(stretch)}
            onCheckedChange={() => onStretchChange(stretch)}
          />
          <span>{stretch}</span>
        </div>
      ))}
    </div>
  </div>
);

export default StretchedMusclesSelector;
