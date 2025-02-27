import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SessionDurationSelectorProps {
  duration: number | '';
  onDurationChange: (value: number | '') => void;
  durations?: number[];
}

const DEFAULT_DURATIONS = [10, 20, 30, 40, 60];

const SessionDurationSelector = ({
  duration,
  onDurationChange,
  durations = DEFAULT_DURATIONS,
}: SessionDurationSelectorProps) => {
  const handleDurationToggle = (value: string) => {
    onDurationChange(value ? parseInt(value) : '');
  };

  return (
    <div className="space-y-1 mt-2">
      <Label htmlFor="duration" className="text-sm">
        Session Duration
      </Label>
      <div className="flex gap-2">
        <ToggleGroup
          type="single"
          value={duration ? duration.toString() : ''}
          onValueChange={handleDurationToggle}
          className="flex bg-stone-50 border rounded-md p-1 grow"
        >
          {durations.map((time) => (
            <ToggleGroupItem
              key={time}
              value={time.toString()}
              className="data-[state=on]:bg-stone-200 h-7 w-full"
            >
              {time}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="relative w-[82px]">
          <Input
            id="duration"
            type="number"
            placeholder="X"
            min={0}
            maxLength={3}
            value={duration}
            onChange={(e) =>
              onDurationChange(e.target.value ? parseInt(e.target.value) : '')
            }
            className="pr-9"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
            min
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionDurationSelector;
